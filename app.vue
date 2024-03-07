<template>
  <ColorScheme>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ColorScheme>
</template>

<script lang="ts" setup>
  const { hostURL } = useRuntimeConfig().public;

  useSchemaOrg([
    defineOrganization({ name: "Apoph'ISEN", logo: '/img/apologo.png' }),
    defineWebSite({ name: "Apoph'ISEN" }),
    defineWebPage(),
  ]);
  useServerSeoMeta({
    ogImage: {
      alt: "Bannière Apoph'ISEN et ses partenaires.",
      type: 'image/png',
      url: `${hostURL}/og/mainBanner.png`,
      width: 1200,
      height: 630,
    },
    twitterCard: 'summary_large_image',
    twitterCreator: '@BayDevTweets',
    twitterDescription: "Apoph'ISEN arrive bientôt, restez connecté·e·s !",
    twitterImage: {
      alt: "Bannière Apoph'ISEN et ses partenaires.",
      type: 'image/png',
      url: `${hostURL}/og/mainBanner.png`,
    },
    twitterSite: '@Apophisen',
    twitterTitle: "Apoph'ISEN",
  });
</script>
