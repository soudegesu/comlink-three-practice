import { Box, Grid, GridList, GridListTile } from '@material-ui/core';
import React, { FC, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import AngryButton from '../components/action/AngryButton';
import LikeButton from '../components/action/LikeButton';
import StatsPanel from '../components/top/StatsPanel';
import VRMCanvas from '../components/vrm/VRMCanvas';
import CanvasProvider from '../provider/CanvasProvider';
import { useWorkerService } from '../provider/WorkerProvider';

const TopPage: FC = () => {
  const url = '/models/AliciaSolid.vrm';
  const cellHeight = 700;
  const canvasWidth = 640;
  const canvasHeight = 480;
  const canvasIds = Array.of(0);
  const { workerService } = useWorkerService();

  useEffect(() => {
    workerService?.draw();
  }, []);

  return (
    <RecoilRoot>
      <StatsPanel />
      <GridList cols={2} cellHeight={cellHeight}>
        {canvasIds.map((i) => (
          <CanvasProvider key={i} canvasId={i}>
            <GridListTile cols={1}>
              <Box>
                <VRMCanvas url={url} height={canvasHeight} width={canvasWidth} />
              </Box>
              <Box marginTop={1}>
                <Grid container spacing={1}>
                  <Grid item>
                    <AngryButton />
                  </Grid>
                  <Grid item>
                    <LikeButton />
                  </Grid>
                </Grid>
              </Box>
            </GridListTile>
          </CanvasProvider>
        ))}
      </GridList>
    </RecoilRoot>
  );
};

export default TopPage;
