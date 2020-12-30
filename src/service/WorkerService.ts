// @ts-ignore
import Worker from 'comlink-loader!../worker/canvasmanager.worker';
import { transfer, proxy } from 'comlink';
import Stats from 'three/examples/jsm/libs/stats.module';

export type ActionType = 'angry';

export class WorkerService {
  private _worker: Worker;
  private _endpoint: any;
  private _stats: Stats;

  constructor() {
    const worker = new Worker();
    this._worker = worker;
    this._stats = Stats();
  }

  async addCanvas(canvas: OffscreenCanvas, id: number, url: string) {
    await this._worker.addCanvas(transfer({ canvas, id, url }, [canvas]));
  }

  async takeAction() {
    // angryAction.play();
    // setTimeout(() => {
    //   angryAction.stop();
    // }, angryAction.getClip().duration * 1000);
  }

  async draw() {
    await this._worker.startDraw(proxy(this._stats));
  }

  getStats() {
    return this._stats;
  }
}
