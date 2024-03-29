import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {
      aspectRatio: { square: '1 / 1' },
      colors: {
        t: { dark: '#', light: '#' },
        back: { dark: '#', light: '#' },
        primary: '#',
        secondary: { dark: '#', light: '#' },
        accent: { dark: '#', light: '#' },
        contrast: '#',
      },
    },
    fontFamily: {
      bahnschrift: ['Bahnschrift', 'sans-serif'],
      centuryGothic: ['Century Gothic', 'sans-serif'],
    },
    fontSize: {
      'fluid-3xs': 'clamp(0.5rem, 0.682vw + 0.364rem, 2rem)',
      'fluid-2xs': 'clamp(0.563rem, 0.767vw + 0.409rem, 2.25rem)',
      'fluid-xs': 'clamp(0.625rem, 0.852vw + 0.455rem, 2.5rem)',
      'fluid-s': 'clamp(0.688rem, 0.938vw + 0.5rem, 2.75rem)',
      'fluid-m': 'clamp(0.75rem, 1.023vw + 0.545rem, 3rem)',
      'fluid-l': 'clamp(0.875rem, 1.193vw + 0.636rem, 3.5rem)',
      'fluid-xl': 'clamp(1rem, 1.364vw + 0.727rem, 4rem)',
      'fluid-2xl': 'clamp(1.125rem, 1.534vw + 0.818rem, 4.5rem)',
      'fluid-3xl': 'clamp(1.25rem, 1.705vw + 0.909rem, 5rem)',
      'fluid-4xl': 'clamp(1.5rem, 2.045vw + 1.091rem, 6rem)',
      'fluid-5xl': 'clamp(1.75rem, 2.386vw + 1.273rem, 7rem)',
      'fluid-6xl': 'clamp(2rem, 2.727vw + 1.455rem, 8rem)',
      'fluid-7xl': 'clamp(2.5rem, 3.409vw + 1.818rem, 10rem)',
      'fluid-8xl': 'clamp(3rem, 4.091vw + 2.182rem, 12rem)',
      'fluid-9xl': 'clamp(4rem, 5.455vw + 2.909rem, 16rem)',
    },
    lineHeight: {
      'fluid-3xs': 'clamp(0.9rem, 0.864vw + 0.727rem, 2.8rem)',
      'fluid-2xs': 'clamp(1.013rem, 0.972vw + 0.818rem, 3.15rem)',
      'fluid-xs': 'clamp(1.125rem, 1.08vw + 0.909rem, 3.5rem)',
      'fluid-s': 'clamp(1.238rem, 1.187vw + 1rem, 3.85rem)',
      'fluid-m': 'clamp(1.35rem, 1.295vw + 1.091rem, 4.2rem)',
      'fluid-l': 'clamp(1.575rem, 1.511vw + 1.273rem, 4.9rem)',
      'fluid-xl': 'clamp(1.8rem, 1.727vw + 1.455rem, 5.6rem)',
      'fluid-2xl': 'clamp(2.025rem, 1.943vw + 1.636rem, 6.3rem)',
      'fluid-3xl': 'clamp(2.25rem, 2.159vw + 1.818rem, 7rem)',
      'fluid-4xl': 'clamp(2.7rem, 2.591vw + 2.182rem, 8.4rem)',
      'fluid-5xl': 'clamp(3.15rem, 3.023vw + 2.545rem, 9.8rem)',
      'fluid-6xl': 'clamp(3.6rem, 3.455vw + 2.909rem, 11.2rem)',
      'fluid-7xl': 'clamp(4.5rem, 4.318vw + 3.636rem, 14rem)',
      'fluid-8xl': 'clamp(5.4rem, 5.182vw + 4.364rem, 16.8rem)',
      'fluid-9xl': 'clamp(7.2rem, 6.909vw + 5.818rem, 22.4rem)',
    },
  },
};
