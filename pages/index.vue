<template>
  <div
    class="background-animate flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-tr from-[#111] to-[#666] text-white"
  >
    <NuxtImg
      alt=""
      aria-hidden="true"
      class="max-h-[75%] w-2/3 object-contain"
      format="webp"
      src="/img/apologo.png"
      sizes="2xl:50vw xl:50vw lg:50vw md:50vw sm:50vw xs:50vw"
    />
    <h1 class="font-centuryGothic text-fluid-6xl font-bold leading-fluid-6xl">
      Work in progress 🧑‍🍳
    </h1>
  </div>
</template>

<style>
  .background-animate {
    background-size: 400%;

    -webkit-animation: Shade 10s ease infinite;
    -moz-animation: Shade 10s ease infinite;
    animation: Shade 10s ease infinite;
  }
  @keyframes Shade {
    0%,
    100% {
      background-position: 0% 100%;
    }
    50% {
      background-position: 100% 0%;
    }
  }
</style>
