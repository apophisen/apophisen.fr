export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return; // Only run client-side

  const base64url = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const [path, oauthState] = sessionStorage.getItem('oauth-state')?.split('|') ?? [];

  if (to.path !== '/wrong-auth') {
    const chars = new Uint8Array(32);
    window.crypto.getRandomValues(chars);
    sessionStorage.setItem(
      'oauth-state',
      `${to.path}|${Array.from(chars)
        .map(c => base64url[c % 64])
        .join('')}`,
    );
  }

  if (to.query.code) {
    if (!to.query.state) return navigateTo('/wrong-auth?reason=missingState');
    if (to.query.state !== oauthState) return navigateTo('/wrong-auth?reason=invalidState');

    const { error } = await useCsrfFetch('/api/user', {
      body: { code: to.query.code },
      method: 'post',
    });
    if (error.value) {
      switch (error.value.statusCode) {
        case 400:
          return navigateTo('/wrong-auth?reason=invalidCode');
        case 403:
          return navigateTo('/wrong-auth?reason=csrfDetection');
        case 501:
          return navigateTo('/wrong-auth?reason=missingClient');
        case 503:
          return navigateTo('/wrong-auth?reason=downAPI');
        default:
          return navigateTo('/wrong-auth?reason=unknown');
      }
    }
    return reloadNuxtApp({ path: useRuntimeConfig().public.hostURL + path, ttl: 0 });
  }
});
