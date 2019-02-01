import Content from './Content';
import * as Global from './Global';

const idMap = {};
const nameMap = {};
const attributeList = [];

let attributeId = 1;

export function AttributeException(message) {
  this.message = message;
  this.name = 'AttributeException';
}

export function AttributeParseException(message) {
  this.message = message;
  this.name = 'AttributeParseException';
}

export default class Attribute extends Content {
  constructor(id, name, realName, description) {
    super();
    this.id = id;
    this.name = name;
    this.realName = realName;
    this.description = description;
    this.order = 2;
    idMap[+id] = this;
    nameMap[name] = this;
    attributeList.push(this);
  }

  static add(name, realName = null, properties = {}) {
    if (nameMap[name]) {
      throw new AttributeException('Attribute already defined');
    }
    let id;
    const description = properties.description || '';
    if (properties.id) {
      const { id: propId } = properties;
      id = propId;
    } else {
      id = attributeId;
      attributeId += 1;
      while (Object.hasOwnProperty.call(idMap, id)) {
        id = attributeId;
        attributeId += 1;
      }
    }
    return new Attribute(id, name, realName || name, description);
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
    return attributeList.slice(0);
  }

  static dumpFullData() {
    let data = Global.packString('ATT');
    let subData = Global.packInteger(attributeList.length);
    attributeList.forEach((attribute) => {
      const attributeData = attribute.dumpData();
      subData += Global.packInteger(attributeData.length);
      subData += attributeData;
    });
    data += Global.packInteger(subData.length);
    data += subData;
    return data;
  }
}
