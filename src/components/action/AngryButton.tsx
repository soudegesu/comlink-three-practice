import { Button } from '@material-ui/core';
import React, { FC } from 'react';
// import { useCanvasState } from '../../provider/CanvasProvider';
import { useWorkerService } from '../../provider/WorkerProvider';

const AngryButton: FC = () => {
  // const { canvasId } = useCanvasState();
  const { workerService } = useWorkerService();

  const handleOnClick = () => {
    if (workerService) {
      workerService.takeAction();
    }
  };

  return (
    <Button color="primary" variant="contained" onClick={handleOnClick}>
      Angry
    </Button>
  );
};

export default AngryButton;
