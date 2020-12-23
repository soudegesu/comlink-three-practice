import React, { useEffect } from 'react';
import { useWorkerService } from '../../provider/WorkerProvider';

const Animation: React.FC = () => {
  const { workerService } = useWorkerService();

  useEffect(() => {
    workerService?.draw();
  }, []);

  return null;
};

export default Animation;
