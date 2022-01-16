import * as _ from 'lodash';
import { describe, it } from 'mocha'
import { expect, use } from 'chai'
import { Models } from 'tnp-models';
import { PortInstance } from '../port-instance';
import { PortsSet } from '../ports-set';

describe('Free port registration', () => {


  it('should compare correcly simple number types', async function () {

    (() => {
      let s = new PortsSet([
        PortInstance.from(Models.other.Range.from(3000).to(5000)),
      ], async (a) => a)

      s.registerOnFreePort({
        name: 'test-service'
      })

      let t1 = PortInstance.from(3000)
      let t2 = PortInstance.from(3000)
      expect(t1.includes(t2)).to.be.true;
    })();

  })
});
