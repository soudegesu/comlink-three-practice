import React, { createContext, FC, useContext } from 'react';

interface CanvasState {
  canvasId: number;
}

export const CanvasStateContext = createContext<CanvasState>({} as CanvasState);

export function useCanvasState() {
  return useContext(CanvasStateContext);
}

interface Props {
  canvasId: number;
  children: React.ReactNode;
}

const CanvasProvider: FC<Props> = ({ canvasId, children }) => {
  return <CanvasStateContext.Provider value={{ canvasId }}>{children}</CanvasStateContext.Provider>;
};

export default CanvasProvider;
