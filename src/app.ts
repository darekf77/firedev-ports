//#region @notForNpm
//#region @backend

import { FiredevCrud } from 'firedev-crud';
import { PortInstance } from './lib/port-instance';
import { PortsController } from './lib/ports-controller';
export default async function () {

  const fd = new FiredevCrud([PortsController], [PortInstance]);
  await fd.init({
    recreate: true
  });
  process.exit(0);
}

//#endregion
//#endregion
