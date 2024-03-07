<template>
  <div
    class="flex h-screen w-screen flex-col items-center justify-center bg-slate-800 text-center text-fluid-xl text-white"
  >
    <p>Authentification échouée : {{ reason }}</p>
    <NuxtLink class="text-blue-400 underline" :href="path">Retour</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
  const reason = {
    missingState: 'connexion non initiée par apophisen.fr ⚠️',
    invalidState: 'connexion non initiée par apophisen.fr ⚠️',
    invalidCode: 'code de connexion invalide',
    csrfDetection: 'connexion non initiée par apophisen.fr ⚠️',
    missingClient: 'serveur non configuré',
    downAPI: "discord n'a pas pu valider la connexion",
    unknown: 'erreur inconnue, veuillez réessayer',
  }[useRoute().query.reason as string];
  const path = sessionStorage.getItem('oauth-state')?.split('|')[0] || '/';

  definePageMeta({
    layout: false,
    middleware: [
      defineNuxtRouteMiddleware((to, from) => {
        if (
          ![
            'missingState',
            'invalidState',
            'invalidCode',
            'csrfDetection',
            'missingClient',
            'downAPI',
            'unknown',
          ].includes(to.query.reason as string)
        )
          return navigateTo('/');
      }),
    ],
  });
  defineRouteRules({ robots: false });
  useSeoMeta({
    description: "Une erreur est survenue lors de l'authentification.",
    title: 'Authentification échouée',
    titleTemplate: '%s',
    twitterDescription: "Une erreur est survenue lors de l'authentification.",
    twitterTitle: 'Authentification échouée',
  });
</script>
