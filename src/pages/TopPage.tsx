import { Box, Grid, GridList, GridListTile } from '@material-ui/core';
import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';
import AngryButton from '../components/action/AngryButton';
import LikeButton from '../components/action/LikeButton';
import AnimationWorker from '../components/AnimationWorker';
import StatsPanel from '../components/top/StatsPanel';
import VRMCanvas from '../components/vrm/VRMCanvas';
import CanvasProvider from '../provider/CanvasProvider';

const TopPage: FC = () => {
  const url = '/models/AliciaSolid.vrm';
  const cellHeight = 700;
  const canvasWidth = 640;
  const canvasHeight = 480;
  const canvasIds = Array.of(0, 1, 2, 3, 4, 5, 6, 7, 8);

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
      <AnimationWorker canvasIds={canvasIds} />
    </RecoilRoot>
  );
};

export default TopPage;
