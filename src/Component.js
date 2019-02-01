import Content from './Content';
import Group from './Group';
import Attribute from './Attribute';
import * as Global from './Global';

const idMap = {};
const nameMap = {};
const perGroup = {};
const perAttribute = {};
const componentList = [];

let componentId = 1;
let componentGroup = null;

export class ComponentException {
  constructor(message) {
    this.message = message;
    this.name = 'ComponentException';
  }
}

export class ComponentParseException {
  constructor(message) {
    this.message = message;
    this.name = 'ComponentParseException';
  }
}

export default class Component extends Content {
  constructor(id, name, realName, description, group) {
    super();
    this.id = id;
    this.name = name;
    this.realName = realName;
    this.description = description;
    this.group = group;
    this.order = 3;
    this.attributes = [];
    idMap[+id] = this;
    nameMap[name] = this;
    if (!perGroup[group.id]) {
      perGroup[group.id] = [];
    }
    perGroup[group.id].push(this);
    componentList.push(this);
  }

  getGroup() {
    return this.group;
  }

  getAttributes() {
    return this.attributes.slice(0);
  }

  dumpData() {
    let data = super.dumpData();
    data += Global.packInteger(this.group.id);
    data += Global.packInteger(this.attributes.length);
    this.attributes.forEach((attribute) => {
      data += Global.packInteger(attribute.id);
    });
    return data;
  }

  static add(name, realName = null, group = null, properties = {}) {
    let id;
    let currentGroup = group;
    const description = properties.description || '';
    if (!currentGroup) {
      currentGroup = componentGroup;
    }
    if (!currentGroup) {
      throw new ComponentException('No group defined');
    }
    if (currentGroup instanceof Group) {
      const oldGroupValue = currentGroup;
      currentGroup = Group.get(oldGroupValue);
      if (!currentGroup) {
        throw new ComponentException(`Group ${oldGroupValue} not found`);
      }
    }
    if (properties.id) {
      const { id: propId } = properties;
      id = propId;
    } else {
      id = componentId;
      componentId += 1;
      while (Object.hasOwnProperty.call(idMap, id)) {
        id = componentId;
        componentId += 1;
      }
    }
    return new Component(id, name, realName || name, description, currentGroup);
  }

  static setDefaultGroup(group) {
    if (!group) {
      return false;
    }
    let currentGroup = group;
    if (currentGroup instanceof Group) {
      const oldGroupValue = currentGroup;
      currentGroup = Group.get(oldGroupValue);
      if (!currentGroup) {
        throw new ComponentException(`Group ${oldGroupValue} not found`);
      }
    }
    componentGroup = currentGroup;
    return true;
  }

  static setAttributes(component, ...attributes) {
    let currentComponent = component;
    if (currentComponent instanceof Component) {
      const oldComponentValue = currentComponent;
      currentComponent = Component.get(oldComponentValue);
      if (!currentComponent) {
        throw new ComponentException(`Component ${oldComponentValue} not found`);
      }
    }
    const attributeValues = [];
    attributes.forEach((attribute) => {
      let currentAttribute = attribute;
      if (currentAttribute instanceof Attribute) {
        const oldAttributeValue = currentAttribute;
        currentAttribute = Attribute.get(oldAttributeValue);
        if (!currentAttribute) {
          throw new ComponentException(`Attribute ${oldAttributeValue} not found`);
        }
      }
      if (!perAttribute[currentAttribute.id]) {
        perAttribute[currentAttribute.id] = [];
      }
      if (!perAttribute[currentAttribute.id].indexOf(currentComponent)) {
        perAttribute[currentAttribute.id].push(currentComponent);
      }
      attributeValues.push(currentAttribute);
    });
    currentComponent.attributes = attributeValues;
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
    return componentList.slice(0);
  }

  static getAllPerGroup(group) {
    let currentGroup = group;
    if (currentGroup instanceof Group) {
      const oldGroupValue = currentGroup;
      currentGroup = Group.get(oldGroupValue);
      if (!currentGroup) {
        throw new ComponentException(`Group ${oldGroupValue} not found`);
      }
    }
    if (!perGroup[currentGroup.id]) {
      return [];
    }
    return perGroup[currentGroup.id].slice(0);
  }

  static getAllPerAttribute(attribute) {
    let currentAttribute = attribute;
    if (currentAttribute instanceof Attribute) {
      const oldAttributeValue = currentAttribute;
      currentAttribute = Attribute.get(oldAttributeValue);
      if (!currentAttribute) {
        throw new ComponentException(`Attribute ${oldAttributeValue} not found`);
      }
    }
    if (!perAttribute[currentAttribute.id]) {
      return [];
    }
    return perAttribute[currentAttribute.id].slice(0);
  }

  static dumpFullData() {
    let data = Global.packString('CMP');
    let subData = Global.packInteger(componentList.length);
    componentList.forEach((component) => {
      const componentData = component.dumpData();
      subData += Global.packInteger(componentData.length);
      subData += componentData;
    });
    data += Global.packInteger(subData.length);
    data += subData;
    return data;
  }
}
