import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useWorkerService } from '../../provider/WorkerProvider';
import { statsAtom } from '../../states/VRMState';

const Animation: React.FC = () => {
  const { workerService } = useWorkerService();
  const stats = useRecoilValue(statsAtom);

  useEffect(() => {
    stats.begin();
    workerService?.draw();
    stats.end();
  }, []);

  return null;
};

export default Animation;
