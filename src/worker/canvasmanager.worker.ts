const canvasIds = [] as number[];
// @ts-ignore
import Worker from 'comlink-loader!../worker/vrmcanvas.worker';
import { transfer } from 'comlink';
import { Clock } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

let rafId = 0;
let statsRef: Stats;
const canvasWorkers = [] as any[];
const clock = new Clock(true);

export async function addCanvas({ canvas, id, url }: { canvas: OffscreenCanvas; id: number; url: string }) {
  console.log(`addCanvas is called`);
  if (canvasIds.findIndex((id) => id === id) > -1) {
    console.log(`Canvas ID: ${id} already exists`);
    return;
  }
  const worker = new Worker();
  const canvasWorker = await new worker.VRMCanvas(transfer({ id, canvas, url }, [canvas]));
  canvasWorkers.push(canvasWorker);
}

export async function startDraw(stats: Stats) {
  statsRef = stats;
  statsRef.begin();
  draw();
  statsRef.end();
}

export async function draw() {
  const delta = clock.getDelta();

  await Promise.all(canvasWorkers.map(async (worker) => await worker.draw(delta)));

  if (statsRef) statsRef.update();
  rafId = requestAnimationFrame(draw);
}

export async function stopDraw() {
  if (rafId !== 0) {
    cancelAnimationFrame(rafId);
  }
}
