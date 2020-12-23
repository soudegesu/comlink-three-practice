// @ts-ignore
import Worker from 'comlink-loader!../worker/canvasmanager.worker';
import { transfer } from 'comlink';

export type ActionType = 'angry';

export class WorkerService {
  private _worker: Worker;
  private _endpoint: any;

  constructor() {
    const worker = new Worker();
    this._worker = worker;
  }

  async addCanvas(canvas: OffscreenCanvas, id: number, url: string) {
    await this._worker.addCanvas(transfer({ canvas, id, url }, [canvas]));
  }

  async takeAction(id: number, action: ActionType) {
    // angryAction.play();
    // setTimeout(() => {
    //   angryAction.stop();
    // }, angryAction.getClip().duration * 1000);
  }

  async draw() {
    await this._worker.draw();
  }
}
