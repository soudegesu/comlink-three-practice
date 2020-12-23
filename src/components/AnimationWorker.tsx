import { FC, useEffect } from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import {
  cameraAtomFamily,
  CanvasId,
  clockAtom,
  mixerAtomFamily,
  rafIdAtom,
  rendererAtomFamily,
  sceneAtomFamily,
  statsAtom,
  vrmAtomFamily,
} from '../states/VRMState';

interface Props {
  canvasIds: CanvasId[];
}

const AnimationWorker: FC<Props> = ({ canvasIds }) => {
  const stats = useRecoilValue(statsAtom);
  const [rafId, setRafId] = useRecoilState(rafIdAtom);

  const runWorker = useRecoilCallback(
    ({ snapshot }) => async () => {
      const clock = await snapshot.getPromise(clockAtom);
      const delta = clock.getDelta();
      canvasIds.forEach(async (canvasId) => {
        const vrm = await snapshot.getPromise(vrmAtomFamily(canvasId));
        const mixer = await snapshot.getPromise(mixerAtomFamily(canvasId));
        const renderer = await snapshot.getPromise(rendererAtomFamily(canvasId));
        const camera = await snapshot.getPromise(cameraAtomFamily(canvasId));
        const scene = await snapshot.getPromise(sceneAtomFamily(canvasId));
        if (vrm) {
          vrm.update(delta);
        }
        if (mixer) {
          mixer.update(delta);
        }
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      });

      stats.update();
      setRafId(requestAnimationFrame(runWorker));
    },
    [],
  );

  useEffect(() => {
    stats.begin();
    runWorker();
    stats.end();
  }, []);

  useEffect(() => {
    return () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
};

export default AnimationWorker;
