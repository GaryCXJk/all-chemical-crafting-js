import Content from './Content';
import * as Global from './Global';

const idMap = {};
const nameMap = {};
const groupList = [];

let groupId = 1;

export function GroupException(message) {
  this.message = message;
  this.name = 'GroupException';
}

export function GroupParseException(message) {
  this.message = message;
  this.name = 'GroupParseException';
}

export default class Group extends Content {
  constructor(id, name, realName, description, color = 0x555555) {
    super();
    this.id = id;
    this.name = name;
    this.realName = realName;
    this.description = description;
    this.order = 1;
    this.color = color;
    this._parent = null; // eslint-disable-line no-underscore-dangle
    this.children = [];
    idMap[+id] = this;
    nameMap[name] = this;
    groupList.push(this);
  }

  get parent() {
    return this._parent; // eslint-disable-line no-underscore-dangle
  }

  set parent(parent) {
    let currentParent = parent;
    if (currentParent !== null) {
      if (Number.isNaN(currentParent) && typeof currentParent === 'string') {
        if (nameMap[currentParent]) {
          currentParent = nameMap[currentParent];
        } else {
          currentParent = null;
        }
      } else if (!Number.isNaN(currentParent)) {
        if (idMap[+currentParent]) {
          currentParent = idMap[+currentParent];
        } else {
          currentParent = null;
        }
      }
      if (currentParent !== null) {
        this._parent = currentParent; // eslint-disable-line no-underscore-dangle
        currentParent.addChild(this);
      }
    }
  }

  get children() {
    return this.children.slice(0);
  }

  addChild(group) {
    if (this.children.indexOf(group) === -1) {
      this.children.push(group);
    }
  }

  dumpData() {
    const parent = this._parent; // eslint-disable-line no-underscore-dangle
    let data = super.dumpData();
    data += Global.packInteger(this.color, 3, true);
    data += Global.packInteger(parent === null ? 0 : 1, 1);
    if (parent !== null) {
      data += Global.packInteger(parent.id);
    }
    return data;
  }

  static add(name, realName = null, properties = {}) {
    if (nameMap[name]) {
      throw new GroupException('Group already defined');
    }
    const {
      id: propId,
    } = properties;
    let id;
    const description = properties.description || '';
    const color = properties.color || 0x555555;
    const parent = properties.parent || null;
    if (properties.id) {
      id = propId;
    } else {
      id = groupId;
      groupId += 1;
      while (Object.hasOwnProperty.call(idMap, id)) {
        id = groupId;
        groupId += 1;
      }
    }
    const group = new Group(id, name, realName || name, description, color);
    group.parent = parent;
    return group;
  }

  static get(identifier) {
    if (Number.isNaN(identifier) && typeof identifier === 'string') {
      return nameMap[identifier] || null;
    }
    if (!Number.isNaN(identifier)) {
      return idMap[+identifier] || null;
    }
    return null;
  }

  static getAll() {
    return groupList.slice(0);
  }

  static dumpFullData() {
    let data = Global.packString('GRP');
    let subData = Global.packInteger(groupList.length);
    groupList.forEach((group) => {
      const groupData = group.dumpData();
      subData += Global.packInteger(groupData.length);
      subData += groupData;
    });
    data += Global.packInteger(subData.length);
    data += subData;
    return data;
  }

  static parseData(data) {
    if (!Global.unpackString(data.slice(0, 4)) !== 'GRP') {
      throw new GroupParseException('No valid group data - Header mismatch');
    }
    const subDataSize = data.slice(4, 8);
    const subData = data.slice(8, 8 + subDataSize);
    const groupListLength = subData.slice(0, 4);
  }
}
