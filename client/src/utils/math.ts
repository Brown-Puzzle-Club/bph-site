const RANDOM_ROTATION_SCALE = 10;
const RANDOM_TRANSLATION_SCALE = 5;

export const RAND_ROT = (scale_factor = RANDOM_ROTATION_SCALE) => {
  return Math.random() * scale_factor - scale_factor / 2;
};
export const RAND_TRANS = () => {
  return Math.floor(Math.random() * 11) - RANDOM_TRANSLATION_SCALE;
};
