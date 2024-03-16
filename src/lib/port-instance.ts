//#region imports
//#region isomorphic
import { _ } from 'tnp-core';
import { Models, DBBaseEntity } from 'tnp-models';
import { BaseProject as Project } from 'tnp-helpers';
import { CLASS } from 'typescript-class-helpers';
//#endregion
import { PortIdType } from './models';
//#endregion

@CLASS.NAME('PortInstance')
export class PortInstance extends DBBaseEntity<any> {
  //#region static methods

  //#region static methods / from
  static from(
    id?: PortIdType,
    reservedFor?: Project | Models.system.SystemService
  ) {
    //#region @backendFunc
    const ins = new PortInstance({ id, reservedFor });
    ins.assignProps();
    return ins;
    //#endregion
  }
  //#endregion

  //#region static methods / clone
  static clone(p: PortInstance): PortInstance {
    //#region @backendFunc
    if (_.isObject(p.id) && !_.isArray(p.id)) {
      return PortInstance.from(Models.other.Range.clone(p.id as any), p.reservedFor);
    }
    if (_.isArray(p.id)) {
      return PortInstance.from(_.cloneDeep(p.id), p.reservedFor);
    }
    return PortInstance.from(p.id, p.reservedFor);
    //#endregion
  }

  //#endregion

  //#endregion

  //#region fields & getters
  public id?: PortIdType;
  public reservedFor?: Project | Models.system.SystemService;

  //#region fields & getters / is free
  get isFree() {
    return !this.reservedFor;
  }
  //#endregion

  //#region fields & getters / array
  get array(): number[] {
    let allPorts = [];
    if (_.isNumber(this.id)) {
      allPorts.push(this.id);
    }
    if (_.isArray(this.id)) {
      allPorts = allPorts.concat(this.id);
    }

    if (!_.isArray(this.id) && _.isObject(this.id)) {
      const range = this.id as Models.other.Range;
      allPorts = allPorts.concat(range.array);
    }

    return allPorts;
  }
  //#endregion

  //#region fields & getters / size
  get size() {
    if (_.isUndefined(this.id)) {
      console.log(this);
      throw new Error(`Undefined id for instace above`);
    }

    if (_.isNumber(this.id)) {
      return 1;
    }
    if (_.isArray(this.id)) {
      return this.id.length;
    }
    // console.log('THIS ID',this.id)
    return (this.id as Models.other.Range).length;
  }
  //#endregion

  //#region fields & getters / sort index
  get sortIndex() {
    if (_.isNumber(this.id)) {
      return this.id;
    }
    if (_.isArray(this.id)) {
      return _.first(this.id);
    }
    return (this.id as Models.other.Range).from;
  }
  //#endregion

  //#endregion

  //#region data

  assignProps() {
    //#region @backend
    const { id, reservedFor } = this.data;
    if (_.isArray(id)) {
      this.id = _.sortBy(id);
    } else {
      this.id = id;
    }
    this.reservedFor = reservedFor;
    //#endregion
  }

  //#region data / prepare instance
  async prepareInstance(): Promise<PortInstance> {
    this.assignProps();
    return this;
  }
  //#endregion

  //#region data / get raw data
  async getRawData() {
    const port = this;
    return _.cloneDeep({
      id: port.id,
      reservedFor: !!port.reservedFor && _.isString((port.reservedFor as Project).location) ?
        (port.reservedFor as Project).location : port.reservedFor
    });
  }
  //#endregion

  //#endregion

  //#region api

  //#region api / add id if possible
  addIdIfPossible(id: PortIdType): boolean {
    if (_.isNumber(this.id) && _.isNumber(id)) {
      this.id = [this.id, id];
      return true;
    }
    if (_.isArray(this.id) && _.isNumber(id)) {
      if (!this.id.includes(id)) {
        this.id.push(id);
        this.makeSmaller();
        return true;
      }
    }
    if (_.isObject(this.id) && _.isNumber(id)) {
      const idRange = this.id as Models.other.Range;
      if (idRange.to + 1 === id) {
        idRange.to = id;
        return true;
      }
    }


    return false;
  }
  //#endregion

  //#region api / make smaller
  /**
   * [1] => 1
   * [1,2,3,4,5] => Range(0 to 5)
   * Range(1 to 1) => 1
   */
  makeSmaller() {
    if (_.isArray(this.id)) {
      if (this.id.length === 0) {
        this.id = _.first(this.id);
        return;
      }
      if (_.first(this.id) + (this.id.length - 1) === _.last(this.id)) {
        this.id = Models.other.Range.from(_.first(this.id)).to(_.last(this.id));
        return;
      }
    }
    if (_.isObject(this.id)) {
      const rangeId = this.id as Models.other.Range;
      if (rangeId.from === rangeId.to) {
        this.id = rangeId.from;
        return;
      }
    }
  }
  //#endregion

  //#region api / is equal
  isEqual(port: PortInstance) {
    if (!port) {
      return false;
    }
    return _.isEqual(this.id, port.id);
  }
  //#endregion

  //#region api / includes
  includes(anotherInstance: PortInstance) {
    const anotherId = anotherInstance.id;

    // simple types
    if (_.isNumber(this.id) && _.isNumber(anotherId)) {
      return this.id === anotherId;
    }

    if (_.isArray(this.id) && _.isArray(anotherId)) {
      return anotherId.filter(another => {
        return (this.id as number[]).includes(another);
      }).length > 0;
    }

    if (_.isObject(this.id) && !_.isArray(this.id) &&
      _.isObject(anotherId) && !_.isArray(anotherId)) {
      const idRange = this.id as Models.other.Range;
      const anotherIdRange = anotherId as Models.other.Range;
      return idRange.contains(anotherIdRange);
    }

    // mixed types
    if (_.isNumber(this.id) && _.isArray(anotherId)) {
      return anotherId.includes(this.id);
    }

    if (_.isNumber(this.id) && _.isObject(anotherId)) {
      return (anotherId as Models.other.Range).contains(this.id);
    }

    if (_.isArray(this.id) && _.isNumber(anotherId)) {
      return this.id.includes(anotherId);
    }

    if (_.isArray(this.id) && _.isObject(anotherId) && !_.isArray(anotherId)) {
      return this.id.filter(num => (anotherId as Models.other.Range).contains(num))
        .length === this.id.length;
    }

    if (_.isObject(this.id) && !_.isArray(this.id) && _.isNumber(anotherId)) {
      return (this.id as Models.other.Range).contains(anotherId);
    }

    if (_.isObject(this.id) && !_.isArray(this.id) && _.isArray(anotherId)) {
      return (anotherId as number[]).filter(num => (this.id as Models.other.Range).contains(num))
        .length === (anotherId as number[]).length;
    }
    // console.warn('Port instacne unknow types')
    return false;
  }
  //#endregion

  //#endregion
}
