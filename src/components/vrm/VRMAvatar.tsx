import React, { FC } from 'react';
import { Group, Scene } from 'three';

interface Props {
  scene: Scene | Group;
}

const VRMAvatar: FC<Props> = ({ scene }) => {
  return <primitive object={scene} dispose={null} />;
};

export default VRMAvatar;
