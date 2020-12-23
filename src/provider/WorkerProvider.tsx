import React, { createContext, FC, useContext, useEffect } from 'react';
// @ts-ignore
import CanvasManager from 'comlink-loader!./worker/canvasmanager.worker';

interface WorkerState {
  worker?: Worker;
}

export const WorkerStateContext = createContext<WorkerState>({} as WorkerState);

export function useWorkerState() {
  return useContext(WorkerStateContext);
}

interface Props {
  children: React.ReactNode;
}

const WorkerProvider: FC<Props> = ({ children }) => {
  useEffect(() => {
    (async () => {
      const manager = new CanvasManager();
    })();
  }, []);

  return <WorkerStateContext.Provider value={{ worker: undefined }}>{children}</WorkerStateContext.Provider>;
};

export default WorkerProvider;
