<template>
  <button
    class="group/NavDiscordButton flex aspect-[3/1] items-center justify-end rounded-full border-2 border-[#5865F2] bg-[#5865F2] text-white"
    @click="
      user
        ? logout()
        : navigateTo(
            `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&response_type=code&redirect_uri=${hostURL}&scope=identify+guilds.join&state=${oauthState}&prompt=none`,
            { external: true },
          )
    "
  >
    <p class="pr-2 text-right text-[2.6vh]">
      {{ user ? `Salut ${user.username} !` : 'Connecte-toi' }}
    </p>
    <div v-if="user" class="aspect-square w-1/3 rounded-full">
      <NuxtImg
        alt=""
        aria-hidden="true"
        class="absolute aspect-square w-1/3 rounded-full"
        crossorigin="anonymous"
        :src="`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}${user.avatar.startsWith('a_') ? '' : '.webp'}?size=128`"
        width="128"
        height="128"
      />
      <NuxtImg
        alt=""
        aria-hidden="true"
        class="absolute z-10 aspect-square w-1/3 rounded-full opacity-0 transition-opacity duration-300 group-hover/NavDiscordButton:opacity-100"
        format="webp"
        src="/img/discordLogout.png"
        sizes="2xl:256px xl:256px lg:256px md:128px sm:128px xs:64px"
      />
    </div>
    <div v-else class="aspect-square w-1/3 rounded-full">
      <NuxtImg
        alt=""
        aria-hidden="true"
        class="absolute z-10 aspect-square w-1/3 rounded-full transition-opacity duration-300 group-hover/NavDiscordButton:opacity-0"
        format="webp"
        src="/img/discordLogo.png"
        sizes="2xl:256px xl:256px lg:256px md:128px sm:128px xs:64px"
      />
      <NuxtImg
        alt=""
        aria-hidden="true"
        class="absolute aspect-square w-1/3 rounded-full"
        src="/img/discordLoading.gif"
        sizes="2xl:256px xl:256px lg:256px md:128px sm:128px xs:64px"
      />
    </div>
  </button>
</template>

<script lang="ts" setup>
  const { discordClientId, hostURL } = useRuntimeConfig().public;
  const oauthState = sessionStorage.getItem('oauth-state')?.split('|')[1];
  const user = (await useCsrfFetch<UserResponse>('/api/user')).data.value;

  const logout = async () => {
    await useCsrfFetch('/api/user', { method: 'delete' });
    reloadNuxtApp({ ttl: 0 });
  };
</script>
