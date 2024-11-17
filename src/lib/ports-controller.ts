// @ts-nocheck
//#region imports
//#region isomorphic
import { Helpers } from 'tnp-helpers';
import { Models, BaseController } from 'tnp-models';
import { CLASS } from 'typescript-class-helpers';
//#endregion
import { PortInstance } from './port-instance';
import { PortsSet } from './ports-set';
//#endregion

@CLASS.NAME('PortsController')
export class PortsController extends BaseController<any> {
  //#region fields & getters
  private _manager: PortsSet;

  //#region fields & getters / manager
  public get manager() {
    //#region @backendFunc
    return new Promise<PortsSet>(async (resolve) => {
      if (!this._manager) {
        const instances = await this.crud.getAll(PortInstance);
        this._manager = new PortsSet(instances as any, async (newPorts) => {
          await this.crud.setBulk(newPorts, PortInstance);
          return await this.crud.getAll(PortInstance);
        });
      }
      resolve(this._manager);
    });
    //#endregion
  }
  //#endregion

  //#endregion

  //#region api

  //#region api / update
  async update() {

  }
  //#endregion

  //#region api / add existed
  async addExisted() {
    //#region @backend
    Helpers.log(`[db][reinit] adding existed ports`);
    const defaultPorts: PortInstance[] = [
      // PortInstance.from(3000, new Models.system.SystemService('standard example apps backend port')),
      // PortInstance.from(4200, new Models.system.SystemService('default angular port')),
      PortInstance.from([80, 443], new Models.system.SystemService('http(s) related')),
      PortInstance.from(6000, new Models.system.SystemService('generaly not working... taken by something else')),
      PortInstance.from(Models.other.Range.from(4300).to(5999)),
    ];

    await this.crud.setBulk(defaultPorts, PortInstance);
    //#endregion
  }
  //#endregion

  //#endregion
}
