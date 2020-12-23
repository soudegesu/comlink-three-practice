import { VRM, VRMSchema } from '@pixiv/three-vrm';
import {
  AnimationClip,
  AnimationMixer,
  Euler,
  LoopOnce,
  NumberKeyframeTrack,
  Quaternion,
  QuaternionKeyframeTrack,
} from 'three';

interface Props {
  vrm: VRM;
  mixer: AnimationMixer;
}

export function createAngryAction({ vrm, mixer }: Props) {
  const angry = vrm.blendShapeProxy?.getBlendShapeTrackName(VRMSchema.BlendShapePresetName.Angry);
  const angryTrack = new NumberKeyframeTrack(
    angry ? angry : '',
    [0.0, 0.2, 0.6, 1.0], // times
    [0.0, 1.0, 1.0, 0.0], // values
  );

  // Actionの登録
  const angryClip = new AnimationClip('iine', 1.5, [angryTrack]);
  const angryAction = mixer.clipAction(angryClip);
  angryAction.weight = 1;
  angryAction.clampWhenFinished = true;
  angryAction.enabled = true;
  angryAction.setLoop(LoopOnce, 0);
  return angryAction;
}

export function createArmAction({ vrm, mixer }: Props) {
  const reftArm = vrm.humanoid?.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm);
  const quatA = new Quaternion(0.0, 0.0, 0.0, 1.0);
  const quatB = new Quaternion(0.0, 0.0, 0.0, 1.0);
  quatB.setFromEuler(new Euler(0.0, 0.0, 0.25 * Math.PI));

  const armTrack = new QuaternionKeyframeTrack(
    reftArm?.name + '.quaternion',
    [0.0, 0.5, 1.0], // times
    [...quatA.toArray(), ...quatB.toArray(), ...quatA.toArray()], // values
  );
  const clip = new AnimationClip('blink', 1.0, [armTrack]);
  return mixer.clipAction(clip);
}
