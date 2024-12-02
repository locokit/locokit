export interface ColorScheme {
  name?: string
  color: string | null
  backgroundColor: string | null
  position?: number
}

export const COLOR_SCHEME: ColorScheme[] = [
  {
    name: 'silver',
    color: '#484848',
    backgroundColor: '#cdcdcd',
    position: 1,
  },
  {
    name: 'shalimar',
    color: '#484848',
    backgroundColor: '#fffbc2',
    position: 2,
  },
  {
    name: 'egg-white',
    color: '#484848',
    backgroundColor: '#ffedc3',
    position: 3,
  },
  {
    name: 'watusi',
    color: '#484848',
    backgroundColor: '#ffe1d2',
    position: 4,
  },
  {
    name: 'pippin',
    color: '#484848',
    backgroundColor: '#ffe4ea',
    position: 5,
  },
  {
    name: 'pink-lace',
    color: '#484848',
    backgroundColor: '#ffdeff',
    position: 6,
  },
  {
    name: 'fog',
    color: '#484848',
    backgroundColor: '#e1e0ff',
    position: 7,
  },
  {
    name: 'hint-of-green',
    color: '#484848',
    backgroundColor: '#e3feeb',
    position: 8,
  },
  {
    name: 'tusk',
    color: '#484848',
    backgroundColor: '#e4f7cf',
    position: 9,
  },
  {
    name: 'oyster-bay',
    color: '#484848',
    backgroundColor: '#dffbff',
    position: 10,
  },
  {
    name: 'pattens-blue',
    color: '#484848',
    backgroundColor: '#deedff',
    position: 11,
  },
  {
    name: 'tropical-blue',
    color: '#484848',
    backgroundColor: '#c3d8fa',
    position: 12,
  },
  {
    name: 'gallery',
    color: '#484848',
    backgroundColor: '#ededed',
    position: 13,
  },
  {
    name: 'dandelion',
    color: '#ffffff',
    backgroundColor: '#fdda5b',
    position: 14,
  },
  {
    name: 'tacao',
    color: '#ffffff',
    backgroundColor: '#f0b688',
    position: 15,
  },
  {
    name: 'froly',
    color: '#ffffff',
    backgroundColor: '#f87e8e',
    position: 16,
  },
  {
    name: 'light-orchid',
    color: '#ffffff',
    backgroundColor: '#e499da',
    position: 17,
  },
  {
    name: 'dull-lavender',
    color: '#ffffff',
    backgroundColor: '#aa7bea',
    position: 18,
  },
  {
    name: 'perano',
    color: '#ffffff',
    backgroundColor: '#afa2f4',
    position: 19,
  },
  {
    name: 'emerald',
    color: '#ffffff',
    backgroundColor: '#67d187',
    position: 20,
  },
  {
    name: 'granny-smith-apple',
    color: '#ffffff',
    backgroundColor: '#bae396',
    position: 21,
  },
  {
    name: 'blizzard-blue',
    color: '#ffffff',
    backgroundColor: '#99daef',
    position: 22,
  },
  {
    name: 'viking',
    color: '#ffffff',
    backgroundColor: '#5bd4d5',
    position: 23,
  },
  {
    name: 'malibu',
    color: '#ffffff',
    backgroundColor: '#55b3fe',
    position: 24,
  },
]

/**
 * from https://uicolors.app/create with #005767 and fic input color to 500 shade
 */
const primary = {
  '50': '#d9feff',
  '100': '#9efbff',
  '200': '#47f8ff',
  '300': '#00c1c8',
  '400': '#006367',
  '500': '#005767',
  DEFAULT: '#005767',
  '600': '#00445c',
  '700': '#003549',
  '800': '#002a3a',
  '900': '#001d2a',
  '950': '#001622',
}

/**
 * from https://uicolors.app/create with #ff8d00 and fic input color to 500 shade
 */
const secondary = {
  '50': '#fff9eb',
  '100': '#fff2d1',
  '200': '#ffe2a2',
  '300': '#ffcb67',
  '400': '#ffa82a',
  '500': '#ff8d00',
  DEFAULT: '#ff8d00',
  '600': '#f57400',
  '700': '#c45402',
  '800': '#9b420b',
  '900': '#7d380c',
  '950': '#431a04',
}
export const TAILWIND_COLORS = {
  primary,
  secondary,
}
