interface AccessTokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordTokens {
  access_token: string;
  expires_at: number;
  refresh_token: string;
}

interface DiscordUser {
  avatar: string;
  global_name: string;
  id: string;
}

export const getDiscordTokens = async (code: string) => {
  let tokens: DiscordTokens | null = {
    access_token: '',
    expires_at: Math.floor(Date.now() / 1000),
    refresh_token: '',
  };

  try {
    const { access_token, expires_in, refresh_token } = await $fetch<AccessTokenResponse>(
      'https://discord.com/api/oauth2/token',
      {
        body: new URLSearchParams({
          client_id: process.env.NUXT_PUBLIC_DISCORD_CLIENT_ID as string,
          client_secret: process.env.DISCORD_CLIENT_SECRET as string,
          code,
          grant_type: 'authorization_code',
          redirect_uri: process.env.NUXT_PUBLIC_HOST_URL as string,
        }).toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
      },
    );
    tokens.access_token = access_token;
    tokens.expires_at += expires_in;
    tokens.refresh_token = refresh_token;
  } catch (error) {
    if (isNaN(Number((error as { message: string }).message.split(' ')[2]))) tokens = null;
  }

  return tokens;
};

export const getDiscordUser = async (accessToken: string) => {
  return await $fetch<DiscordUser>('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch(() => {
    return null;
  });
};

const guilds = {
  apophisen: '448218611971260420',
  'tft-academic-legends': '1168590148414488637',
};
export const joinToGuild = async (
  userId: string,
  accessToken: string,
  guildId: keyof typeof guilds,
) => {
  $fetch(`https://discord.com/api/guilds/${guilds[guildId]}/members/${userId}`, {
    body: { access_token: accessToken },
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  }).catch(e => console.log(e));
};

export const refreshDiscordTokens = async (refreshToken: string) => {
  let tokens: DiscordTokens | null = {
    access_token: '',
    expires_at: Math.floor(Date.now() / 1000),
    refresh_token: '',
  };

  try {
    const { access_token, expires_in, refresh_token } = await $fetch<AccessTokenResponse>(
      'https://discord.com/api/oauth2/token',
      {
        body: new URLSearchParams({
          client_id: process.env.NUXT_PUBLIC_DISCORD_CLIENT_ID as string,
          client_secret: process.env.DISCORD_CLIENT_SECRET as string,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }).toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
      },
    );
    tokens.access_token = access_token;
    tokens.expires_at += expires_in;
    tokens.refresh_token = refresh_token;
  } catch (error) {
    tokens = null;
  }

  return tokens;
};
