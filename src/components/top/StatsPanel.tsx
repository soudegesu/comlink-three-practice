import { Box } from '@material-ui/core';
import React, { FC, useEffect, useRef } from 'react';
import { useWorkerService } from '../../provider/WorkerProvider';

const StatsPanel: FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { workerService } = useWorkerService();

  useEffect(() => {
    const stats = workerService?.getStats();
    if (ref && ref.current && stats) {
      stats.showPanel(0);
      ref.current.appendChild(stats.dom);
    }
  }, [ref, workerService]);

  return (
    <Box position="absolute">
      <div ref={ref}></div>
    </Box>
  );
};

export default StatsPanel;
