import { atom } from 'recoil';
import Stats from 'three/examples/jsm/libs/stats.module';

const atomKeyPrefix = 'atom';

export type CanvasId = number | string;

export const statsAtom = atom<Stats>({
  key: `${atomKeyPrefix}/stats`,
  default: Stats(),
});
