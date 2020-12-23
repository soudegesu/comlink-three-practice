const canvasIds = [] as number[];
// @ts-ignore
import Worker from 'comlink-loader!../worker/vrmcanvas.worker';
import { transfer } from 'comlink';
import { Clock } from 'three';

const worker = new Worker();
let rafId = 0;
const canvasWorkers = [] as any[];
const clock = new Clock(true);

export async function addCanvas({ canvas, id, url }: { canvas: OffscreenCanvas; id: number; url: string }) {
  if (canvasIds.findIndex((id) => id === id) > -1) {
    console.log(`Canvas ID: ${id} already exists`);
    return;
  }
  const canvasWorker = await new worker.VRMCanvas(transfer({ id, canvas, url }, [canvas]));
  canvasWorkers.push(canvasWorker);
}

export async function draw() {
  const delta = clock.getDelta();

  canvasWorkers.forEach((worker) => {
    worker.draw(delta);
  });

  rafId = requestAnimationFrame(draw);
}

export async function stopDraw() {
  if (rafId !== 0) {
    cancelAnimationFrame(rafId);
  }
}
