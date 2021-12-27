//#region @notForNpm
//#region @backend

import { FiredevCrud } from 'firedev-crud';
import { PortInstance } from './port-instance';
import { PortsController } from './ports-controller';
export default async function () {

  const fd = new FiredevCrud([PortsController], [PortInstance]);
  await fd.init({
    recreate: true
  });
  process.exit(0);
}

//#endregion
//#endregion
