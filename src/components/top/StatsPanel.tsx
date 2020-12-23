import { Box } from '@material-ui/core';
import React, { FC, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { statsAtom } from '../../states/VRMState';

const StatsPanel: FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const stats = useRecoilValue(statsAtom);

  useEffect(() => {
    if (ref && ref.current && stats) {
      stats.showPanel(0);
      ref.current.appendChild(stats.dom);
    }
  }, [ref, stats]);

  return (
    <Box position="absolute">
      <div ref={ref}></div>
    </Box>
  );
};

export default StatsPanel;
