import { User } from '../models/index';
import { encryptSymmetric, newSessionToken } from '../utils/security';
import { getDiscordTokens, getDiscordUser, joinToGuild } from '../utils/discord/api';

export default defineEventHandler(async event => {
  if (!process.env.NUXT_PUBLIC_DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET)
    return event.respondWith(
      new Response('Not Implemented: missing Discord client configuration.', { status: 501 }),
    );

  const oauthCode: string = (await readBody(event)).code;
  const tokens = await getDiscordTokens(oauthCode);
  if (!tokens)
    return event.respondWith(
      new Response('Service Unavailable: the Discord API did not respond.', { status: 503 }),
    );
  if (!tokens.access_token)
    return event.respondWith(
      new Response('Bad Request: invalid oauth code provided.', { status: 400 }),
    );

  const discordUser = await getDiscordUser(tokens.access_token);
  if (!discordUser)
    return event.respondWith(
      new Response('Service Unavailable: the Discord API did not respond.', { status: 503 }),
    );

  let session: string;
  const DbUser = await User.findById(discordUser.id);
  if (!DbUser) {
    do session = newSessionToken();
    while (await User.exists({ sessionToken: session }));
    const { ciphertext, iv, tag } = encryptSymmetric(process.env.AES_KEY as string, session);

    joinToGuild(discordUser.id, tokens.access_token, 'apophisen');

    User.create({
      _id: discordUser.id,
      avatar: discordUser.avatar,
      discordAccess: { expiresAt: tokens.expires_at, iv, tag, token: ciphertext },
      discordRefreshToken: tokens.refresh_token,
      sessionToken: session,
      username: discordUser.global_name,
    });
  } else {
    session = DbUser.sessionToken;

    if (tokens.refresh_token !== DbUser.discordRefreshToken) {
      const { ciphertext, iv, tag } = encryptSymmetric(
        process.env.AES_KEY as string,
        tokens.access_token,
      );

      DbUser.avatar = discordUser.avatar;
      DbUser.discordAccess = {
        expiresAt: tokens.expires_at as unknown as bigint,
        iv,
        tag,
        token: ciphertext,
      };
      DbUser.discordRefreshToken = tokens.refresh_token;
      DbUser.username = discordUser.global_name;
    } else DbUser.discordAccess.expiresAt = tokens.expires_at as unknown as bigint;
    DbUser.save();
  }

  const { ciphertext, iv, tag } = encryptSymmetric(process.env.AES_KEY as string, session);
  const sessionCookie = `${ciphertext}|${iv}|${tag}`;

  return setCookie(event, 'session', sessionCookie, {
    expires: new Date(new Date().setMonth(new Date().getMonth() + 1)), // in 1 month
    httpOnly: true,
    maxAge: 2_628_288, // 1 average month
    priority: 'high',
    sameSite: 'strict',
    secure: useRuntimeConfig(event).public.hostURL.startsWith('https'),
  });
});
