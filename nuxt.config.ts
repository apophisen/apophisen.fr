export default defineNuxtConfig({
  colorMode: { classSuffix: '', fallback: 'dark', preference: 'system' },
  devtools: { enabled: true, timeline: { enabled: true } },
  experimental: { inlineRouteRules: true },
  modules: [
    '@formkit/auto-animate/nuxt',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/seo',
    'nuxt-security',
  ],
  ogImage: { enabled: false },
  routeRules: {
    '/api/**': {
      security: {
        allowedMethodsRestricter: { methods: ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'] },
      },
    },
    '/discord/**': { redirect: { to: 'https://discord.gg/NkKhc4y', statusCode: 301 } },
    '/facebook/**': { redirect: { to: 'https://www.facebook.com/ApophISEN', statusCode: 301 } },
    '/instagram/**': { redirect: { to: 'https://www.instagram.com/apophisen/', statusCode: 301 } },
    '/linkedin/**': {
      redirect: { to: 'https://www.linkedin.com/company/apophisen/', statusCode: 301 },
    },
    '/twitch/**': { redirect: { to: 'https://www.twitch.tv/apophisen', statusCode: 301 } },
    '/twitter/**': { redirect: { to: 'https://twitter.com/apophisen', statusCode: 301 } },
    '/youtube/**': { redirect: { to: 'https://www.youtube.com/@ApophISEN', statusCode: 301 } },
  },
  runtimeConfig: { public: { discordClientId: '', hostURL: '' } },
  security: {
    allowedMethodsRestricter: { methods: ['GET'] },
    csrf: {
      https: process.env.NUXT_PUBLIC_HOST_URL?.startsWith('https'),
      methodsToProtect: ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'],
      excludedUrls: [['^(?!/api/(?!interactions)).+', '']],
    },
    headers: {
      contentSecurityPolicy: {
        'child-src': [process.env.NODE_ENV === 'development' ? "'self'" : "'none'"],
        'default-src': ["'self'"],
        'font-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'img-src': ["'self'", 'https://cdn.discordapp.com/avatars/'],
        'script-src': ["'nonce-{{nonce}}'", "'self'", "'strict-dynamic'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'style-src-attr': ["'none'"],
      },
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
    },
  },
  site: {
    defaultLocale: 'fr',
    description: "Apoph'ISEN arrive bientôt, restez connecté·e·s !",
    identity: { type: 'Organization' },
    name: "Apoph'ISEN",
    redirectToCanonicalSiteUrl: true,
    url: process.env.NUXT_PUBLIC_HOST_URL,
  },
  sitemap: {
    xslColumns: [
      { label: 'URL', width: '55%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '20%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
    ],
  },
  typescript: { shim: false },
});
