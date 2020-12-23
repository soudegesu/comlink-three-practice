import React, { createContext, FC, useContext } from 'react';
import { WorkerService } from '../service/WorkerService';

interface WorkerState {
  workerService?: WorkerService;
}

export const WorkerServiceContext = createContext<WorkerState>({} as WorkerState);

export function useWorkerService() {
  return useContext(WorkerServiceContext);
}

interface Props {
  children: React.ReactNode;
}

const WorkerProvider: FC<Props> = ({ children }) => {
  return (
    <WorkerServiceContext.Provider value={{ workerService: new WorkerService() }}>
      {children}
    </WorkerServiceContext.Provider>
  );
};

export default WorkerProvider;
