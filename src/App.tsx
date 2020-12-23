import { Container } from '@material-ui/core';
import React from 'react';
import './App.css';
import TopPage from './pages/TopPage';
import WorkerProvider from './provider/WorkerProvider';

const App = () => {
  return (
    <WorkerProvider>
      <Container>
        <TopPage />
      </Container>
    </WorkerProvider>
  );
};

export default App;
