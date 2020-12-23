/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useRef } from 'react';
import { useCanvasState } from '../../provider/CanvasProvider';
import { useWorkerService } from '../../provider/WorkerProvider';

interface Props {
  url: string;
  height: number | string;
  width: number | string;
}

const VRMCanvas: FC<Props> = ({ url, height, width }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { canvasId } = useCanvasState();
  const { workerService } = useWorkerService();

  useEffect(() => {
    if (canvasRef && canvasRef.current && workerService) {
      const canvas = canvasRef.current.transferControlToOffscreen();
      workerService.addCanvas(canvas, canvasId, url);
    }
  }, [canvasRef.current]);

  return <canvas ref={canvasRef} height={height} width={width} style={{ background: 'black' }} />;
};

export default VRMCanvas;
