/* eslint-disable react-hooks/exhaustive-deps */
import { VRM, VRMSchema, VRMUtils } from '@pixiv/three-vrm';
import React, { FC, Suspense, useEffect } from 'react';
import { Canvas, CanvasContext } from 'react-three-fiber';
import { useRecoilBridgeAcrossReactRoots_UNSTABLE, useRecoilState, useSetRecoilState } from 'recoil';
import { AnimationMixer, Vector3 } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import VRMAvatar from '../../components/vrm/VRMAvatar';
import { CanvasStateContext, useCanvasState } from '../../provider/CanvasProvider';
import {
  armAnimationAtomFamily,
  cameraAtomFamily,
  angryAnimationAtomFamily,
  mixerAtomFamily,
  vrmAtomFamily,
  rendererAtomFamily,
  sceneAtomFamily,
} from '../../states/VRMState';
import { createAngryAction, createArmAction } from '../../util/animationActionCreator';

interface Props {
  url: string;
  height: number | string;
  width: number | string;
}

const VRMCanvas: FC<Props> = ({ url, height, width }) => {
  const { canvasId } = useCanvasState();
  const [vrm, setVrm] = useRecoilState(vrmAtomFamily(canvasId));
  const [camera, setCamera] = useRecoilState(cameraAtomFamily(canvasId));
  const setMixer = useSetRecoilState(mixerAtomFamily(canvasId));
  const setRenderer = useSetRecoilState(rendererAtomFamily(canvasId));
  const setFunActionState = useSetRecoilState(angryAnimationAtomFamily(canvasId));
  const setArmActionState = useSetRecoilState(armAnimationAtomFamily(canvasId));
  const setScene = useSetRecoilState(sceneAtomFamily(canvasId));
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  useEffect(() => {
    (async () => {
      const gltf = (await new GLTFLoader().loadAsync(url, () => {})) as GLTF;
      VRMUtils.removeUnnecessaryJoints(gltf.scene);
      const vrm = await VRM.from(gltf);

      // 180°回転
      const boneNode = vrm.humanoid?.getBoneNode(VRMSchema.HumanoidBoneName.Hips);
      if (boneNode) boneNode.rotateY(Math.PI);
      // 左腕を下ろす
      const leftArm = vrm.humanoid?.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm);
      if (leftArm) leftArm.rotateZ((Math.PI * 2) / 5);
      // 右腕を下ろす
      const rightArm = vrm.humanoid?.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm);
      if (rightArm) rightArm.rotateZ((-Math.PI * 2) / 5);

      // Animation Mixerを作成
      const mixer = new AnimationMixer(vrm.scene);

      // 怒った顔
      const angryAction = createAngryAction({ vrm, mixer });
      setFunActionState(angryAction);

      // 腕を上げ下げする
      const armAction = createArmAction({ vrm, mixer });
      armAction.play();
      setArmActionState(armAction);
      setMixer(mixer);
      setVrm(vrm);
    })();
  }, [url]);

  useEffect(() => {
    if (!vrm || !camera) {
      return;
    }
    // 首の位置を基準にする
    const neck = vrm.humanoid?.getBoneNode(VRMSchema.HumanoidBoneName.Neck);
    if (neck) {
      const neckPos = new Vector3();
      neck.getWorldPosition(neckPos);
      camera.position.set(0, neckPos.y, 0.5);
      camera.lookAt(0, neckPos.y, 0);
    }
  }, [vrm, camera]);

  const handleOnCreated = ({ clock, scene, camera, gl }: CanvasContext) => {
    //　Clockはグローバルに1つにするためここでは有効化しない
    if (clock.running) clock.stop();
    setScene(scene);
    setCamera(camera);
    setRenderer(gl);
  };

  return (
    <CanvasStateContext.Consumer>
      {(value) => (
        <Canvas
          style={{ background: 'black', width, height, border: 'solid 1px black' }}
          camera={{ fov: 50, aspect: 4.0 / 3.0, near: 0.4, far: 1.0 }}
          onCreated={handleOnCreated}
          invalidateFrameloop={true}
        >
          <CanvasStateContext.Provider value={value}>
            <RecoilBridge>
              <directionalLight color="#ffffff" intensity={0.3} position={new Vector3(1, 1, 1).normalize()} />
              <Suspense fallback={null}>{vrm && <VRMAvatar scene={vrm.scene} />}</Suspense>
            </RecoilBridge>
          </CanvasStateContext.Provider>
        </Canvas>
      )}
    </CanvasStateContext.Consumer>
  );
};

export default VRMCanvas;
