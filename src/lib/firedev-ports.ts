// // @ts-nocheck
// //#region imports
// //#region isomorphic
// import { FiredevCrud } from 'firedev-crud';
// import { Models } from 'tnp-models';
// //#endregion
// import { PortInstance } from './port-instance';
// import { PortsController } from './ports-controller';
// import { PortsSet } from './ports-set';
// //#endregion

// /**
//  * Do not use this with tnp-db
//  */
// export class FiredevPorts {

//   //#region static fields & getters
//   //#region @backend
//   private static _instance = new FiredevPorts();
//   //#endregion
//   //#endregion

//   //#region fields & gettes
//   private portsManager?: PortsSet;

//   //#region fields & gettes / instace
//   /**
//    * This is only for standalone use... not with tnp-db
//    */
//   public static get instance() {
//     //#region @backendFunc
//     return new Promise<FiredevPorts>(async (resolve) => {
//       const fd = new FiredevCrud([PortsController], [PortInstance]);
//       await fd.init({
//         recreate: true
//       });

//       const ctrl = fd.getCtrlInstanceBy<PortsController>(PortsController);
//       const manager = await ctrl.manager;
//       FiredevPorts._instance.portsManager = manager;
//       resolve(FiredevPorts._instance);
//     });
//     //#endregion
//   }
//   //#endregion

//   //#endregion

//   //#region constructor
//   private constructor() { }
//   //#endregion

//   //#region api
//   async registerUniqeServiceAndGetPort(name: string, killAlreadyRegisterd = true) {
//     //#region @backendFunc
//     const port = await this.portsManager.registerOnFreePort(new Models.system.SystemService(name), {
//       killAlreadyRegisterd
//     });
//     return port;
//     //#endregion
//   }
//   //#endregion
// }
