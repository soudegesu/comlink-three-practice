import { Button } from '@material-ui/core';
import React, { FC } from 'react';

const LikeButton: FC = () => {
  const handleOnClick = () => {};

  return (
    <Button color="primary" variant="contained" onClick={handleOnClick}>
      Like
    </Button>
  );
};

export default LikeButton;
