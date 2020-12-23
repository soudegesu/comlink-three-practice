import { VRM, VRMSchema, VRMUtils } from '@pixiv/three-vrm';
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Camera,
  Color,
  DirectionalLight,
  Euler,
  LoopOnce,
  NumberKeyframeTrack,
  PerspectiveCamera,
  Quaternion,
  QuaternionKeyframeTrack,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class VRMCanvas {
  private _id: number;
  private _canvas: OffscreenCanvas;
  private _scene: Scene;
  private _renderer: WebGLRenderer;
  private _camera: Camera;
  private _light: DirectionalLight;
  private _vrm?: VRM;
  private _mixer?: AnimationMixer;
  private _armAction?: AnimationAction;
  private _angryAction?: AnimationAction;

  constructor({ id, canvas, url }: { id: number; canvas: OffscreenCanvas; url: string }) {
    this._id = id;
    this._canvas = canvas;
    const context = canvas.getContext('webgl') as WebGLRenderingContext;
    this._renderer = new WebGLRenderer({ canvas, context });
    this._camera = new PerspectiveCamera(50, 4.0 / 3.0, 0.4, 1.0);
    this._scene = new Scene();
    this._light = new DirectionalLight(new Color('#ffffff'), 0.8);
    this._light.position.set(1, 1, 1).normalize();
    this._scene.add(this._light);
    (async () => {
      await this.loadVrm(url);
    })();
  }

  async loadVrm(url: string) {
    const gltf = (await new GLTFLoader().loadAsync(url, () => {})) as GLTF;
    VRMUtils.removeUnnecessaryJoints(gltf.scene);
    const vrm = await VRM.from(gltf);

    // 180°回転`
    const boneNode = vrm.humanoid?.getBoneNode(VRMSchema.HumanoidBoneName.Hips);
    if (boneNode) boneNode.rotateY(Math.PI);
    // 左腕を下ろす＝
    const leftArm = vrm.humanoid?.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm);
    if (leftArm) leftArm.rotateZ((Math.PI * 2) / 5);
    // 右腕を下ろす
    const rightArm = vrm.humanoid?.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm);
    if (rightArm) rightArm.rotateZ((-Math.PI * 2) / 5);

    // Animation Mixerを作成
    const mixer = new AnimationMixer(vrm.scene);

    // 怒った顔
    const angryAction = createAngryAction({ vrm, mixer });
    this._angryAction = angryAction;

    // 腕を上げ下げする
    const armAction = createArmAction({ vrm, mixer });
    armAction.play();

    this._armAction = armAction;
    this._mixer = mixer;
    this._vrm = vrm;
    this._scene.add(vrm.scene);

    // 首の位置を基準にする
    const neck = this._vrm.humanoid?.getBoneNode(VRMSchema.HumanoidBoneName.Neck);
    if (neck) {
      const neckPos = new Vector3();
      neck.getWorldPosition(neckPos);
      this._camera.position.set(0, neckPos.y, 0.5);
      this._camera.lookAt(0, neckPos.y, 0);
    }
  }

  draw(delta: number) {
    if (this._vrm) {
      this._vrm.update(delta);
    }
    if (this._mixer) {
      this._mixer.update(delta);
    }
    if (this._renderer && this._scene && this._camera) {
      this._renderer.render(this._scene, this._camera);
    }
  }
}

interface Props {
  vrm: VRM;
  mixer: AnimationMixer;
}

function createAngryAction({ vrm, mixer }: Props) {
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

function createArmAction({ vrm, mixer }: Props) {
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
