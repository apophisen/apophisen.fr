import { User } from '../models/index';
import { decryptSymmetric } from '../utils/security';
import { getDiscordUser, refreshDiscordTokens } from '../utils/discord/api';

export default defineEventHandler(async event => {
  if (!process.env.NUXT_PUBLIC_DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET)
    return event.respondWith(
      new Response('Not Implemented: missing Discord client configuration.', { status: 501 }),
    );

  const sessionCookie = getCookie(event, 'session');
  if (!sessionCookie)
    return event.respondWith(
      new Response('null', { headers: { 'Content-Type': 'application/json' } }),
    );

  const [ciphertext, iv, tag] = sessionCookie.split('|');
  const sessionToken = decryptSymmetric(process.env.AES_KEY as string, ciphertext, iv, tag);

  const discordUser = await User.findOne(
    { sessionToken },
    '_id avatar discordAccess discordRefreshToken username',
  );
  if (!discordUser)
    return event.respondWith(
      new Response('null', { headers: { 'Content-Type': 'application/json' } }),
    );

  let accessToken = '';
  if (discordUser.discordAccess.expiresAt < Math.floor(Date.now() / 1000)) {
    const tokens = await refreshDiscordTokens(discordUser.discordRefreshToken);
    if (tokens) {
      accessToken = tokens.access_token;
      const { ciphertext, iv, tag } = encryptSymmetric(
        process.env.AES_KEY as string,
        tokens.access_token,
      );
      discordUser.discordAccess = {
        expiresAt: tokens.expires_at as unknown as bigint,
        iv,
        tag,
        token: ciphertext,
      };
      discordUser.discordRefreshToken = tokens.refresh_token;
    }
  } else {
    accessToken = decryptSymmetric(
      process.env.AES_KEY as string,
      discordUser.discordAccess.token,
      discordUser.discordAccess.iv,
      discordUser.discordAccess.tag,
    );
  }

  const newDiscordUser = await getDiscordUser(accessToken);
  if (newDiscordUser) {
    discordUser.avatar = newDiscordUser.avatar;
    discordUser.username = newDiscordUser.global_name;
  }

  discordUser.save();
  return event.respondWith(
    new Response(
      JSON.stringify({
        avatar: discordUser.avatar,
        id: discordUser._id,
        username: discordUser.username,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    ),
  );
});
