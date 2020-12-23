import { Button } from '@material-ui/core';
import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { useCanvasState } from '../../provider/CanvasProvider';
import { angryAnimationAtomFamily } from '../../states/VRMState';

const AngryButton: FC = () => {
  const { canvasId } = useCanvasState();
  const angryAction = useRecoilValue(angryAnimationAtomFamily(canvasId));

  const handleOnClick = () => {
    if (!angryAction) {
      return;
    }
    angryAction.play();
    setTimeout(() => {
      angryAction.stop();
    }, angryAction.getClip().duration * 1000);
  };

  return (
    <Button color="primary" variant="contained" onClick={handleOnClick}>
      Angry
    </Button>
  );
};

export default AngryButton;
