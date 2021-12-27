import * as _ from 'lodash';
import * as path from 'path';
import { describe, it } from 'mocha'
import { expect, use } from 'chai'
import { Project } from 'tnp-helpers';
import { Models } from 'tnp-models';
import { PortInstance } from '../port-instance';
import { PortsSet } from '../ports-set.backend';

describe('Ports set tests', () => {

  const standalone = Project.From(path.join(__dirname, '../../projects/standalone-example'));
  const baseline = Project.From(path.join(__dirname, '../../projects/baseline-example'));
  const baselineChild = Project.From(path.join(__dirname, '../../projects/baseline-example/baseline-example-iso-lib'));
  baseline.children = [baselineChild];


  it('should call save after each add', async function () {

    let saveCallCounter = 0;
    let s = new PortsSet([], async (a) => {
      saveCallCounter++;
      return a;
    })

    await s.add(PortInstance.from(Models.other.Range.from(3000).to(4000)))
    await s.add(PortInstance.from(80, new Models.system.SystemService('http')))
    await s.add(PortInstance.from([21, 22], new Models.system.SystemService('System communication')))
    await s.add(PortInstance.from(Models.other.Range.from(4100).to(4110), baseline))

    expect(saveCallCounter).to.be.eq(4);


  });

  it('should calculate,remove,add,update correcly', async function () {

    let s = new PortsSet([
      PortInstance.from([2000, 2001])
    ], async (a) => a)

    expect(s.numOfFreePortsAvailable).to.be.eq(2)
    await s.update(PortInstance.from([2000, 2001], new Models.system.SystemService('test')))
    expect(s.numOfFreePortsAvailable).to.be.eq(0)

    const twoThousandsFreePors = PortInstance.from(Models.other.Range.from(3000).to(5000))
    await s.add(twoThousandsFreePors)
    expect(s.numOfFreePortsAvailable).to.be.eq(2000)
    expect(s.numOfAllPortsAvailable).to.be.eq(2002)
    await s.remove(twoThousandsFreePors)
    expect(s.numOfFreePortsAvailable).to.be.eq(0)
    expect(s.numOfAllPortsAvailable).to.be.eq(2)



  });

  it('should return project ports', async function () {

    let baselinePorts = [
      PortInstance.from(3000, baseline),
      PortInstance.from(4000, baseline)
    ]

    let s = new PortsSet([
      PortInstance.from([2000, 2001]),
      ...baselinePorts
    ], async (a) => a)

    expect(_.isEqual(await s.getReserverFor(baseline), baselinePorts)).to.be.true;

    baselinePorts = []

    expect(_.isEqual(await s.getReserverFor(baseline), baselinePorts)).to.be.false;

  });


  it('should reserve correcly ports for standalone porject', async function () {

    let s = new PortsSet([
      PortInstance.from(4000, baseline),
      PortInstance.from(6000),
      PortInstance.from(Models.other.Range.from(7000).to(7005))
    ], async (a) => a)

    expect(await s.reserveFreePortsFor(standalone)).to.be.true;

  });

  it('should reserve correcly ports for workspace porject', async function () {

    let s = new PortsSet([
      PortInstance.from(4000),
      PortInstance.from(6000),
      PortInstance.from(Models.other.Range.from(7000).to(7010))
    ], async (a) => a)

    expect(await s.reserveFreePortsFor(baseline)).to.be.true;
    expect(s.numOfTakenPortsAvailable).to.be.eq(baseline.children.length + 1)

  });

  it('should not reserve ports if is not a space', async function () {

    let s = new PortsSet([
      PortInstance.from(Models.other.Range.from(7000).to(baseline.children.length))
    ], async (a) => a)

    expect(await s.reserveFreePortsFor(baseline)).to.be.false;

  });


});
