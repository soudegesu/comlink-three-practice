import React, { createContext, FC, useContext } from 'react';
import { WorkerService } from '../service/WorkerService';

interface WorkerState {
  workerService?: WorkerService;
}

// 専用ワーカーの数が増えないようにするため、initStateを共有する
const initalState = { workerService: new WorkerService() };

const WorkerServiceContext = createContext<WorkerState>(initalState);

export function useWorkerService() {
  return useContext(WorkerServiceContext);
}

interface Props {
  children: React.ReactNode;
}

const WorkerProvider: FC<Props> = ({ children }) => {
  return <WorkerServiceContext.Provider value={initalState}>{children}</WorkerServiceContext.Provider>;
};

export default WorkerProvider;
