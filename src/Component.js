import Content from './Content'
import Group from './Group'
import Attribute from './Attribute'
import * as Global from './Global'

const idMap = {}
const nameMap = {}
const perGroup = {}
const perAttribute = {}
const componentList = []

let componentId = 1
let componentGroup = null

export function ComponentException(message) {
    this.message = message
    this.name = 'ComponentException'
}

export function ComponentParseException(message) {
    this.message = message
    this.name = 'ComponentParseException'
}

class Component extends Content {
    constructor(id, name, realName, description, group) {
        super()
        this._id = id
        this._name = name
        this._realName = realName
        this._description = description
        this._group = group
        this._order = 3
        this._attributes = []
        idMap[+id] = this
        nameMap[name] = this
        if(!perGroup[group.id]) {
            perGroup[group.id] = []
        }
        perGroup[group.id].push(this)
        componentList.push(this)
    }

    getGroup() {
        return this._group
    }

    getAttributes() {
        return this._attributes.slice(0)
    }
    
    dumpData() {
        let data = super.dumpData()
        data+= Global.packInteger(this._group.id)
        data+= Global.packInteger(this._attributes.length)
        this._attributes.forEach(attribute => {
            data+= Global.packInteger(attribute.id)
        })
        return data
    }

    static add(name, realName = null, group = null, properties = {}) {
        let id
        let description = properties.description || ''
        if(!group) {
            group = componentGroup
        }
        if(!group) {
            throw new ComponentException('No group defined')
        }
        if(group instanceof Group) {
            let oldGroupValue = group
            group = Group.get(oldGroupValue)
            if(!group) {
                throw new ComponentException('Group ' + oldGroupValue + ' not found')
            }
        }
        if(properties.id) {
            id = properties.id
        } else {
            id = componentId++
            while(idMap.hasOwnProperty(id)) {
                id = componentId++
            }
        }
        if(!realName) {
            realName = name
        }
        return new Component(id, name, realName, description, group)
    }

    static setDefaultGroup(group) {
        if(!group) {
            return false
        }
        if(group instanceof Group) {
            let oldGroupValue = group
            group = Group.get(oldGroupValue)
            if(!group) {
                throw new ComponentException('Group ' + oldGroupValue + ' not found')
            }
        }
        componentGroup = group
    }

    static setAttributes(component, ...attributes) {
        if(component instanceof Component) {
            let oldComponentValue = component
            component = Component.get(oldComponentValue)
            if(!component) {
                throw new ComponentException('Component ' + oldComponentValue + ' not found')
            }
        }
        let attributeValues = []
        attributes.forEach(attribute => {
            if(attribute instanceof Attribute) {
                let oldAttributeValue = attribute
                attribute = Attribute.get(oldAttributeValue)
                if(!attribute) {
                    throw new ComponentException('Attribute ' + oldAttributeValue + ' not found')
                }
            }
            if(!perAttribute[attribute.id]) {
                perAttribute[attribute.id] = []
            }
            if(!perAttribute[attribute.id].indexOf(component)) {
                perAttribute[attribute.id].push(component)
            }
            attributeValues.push(attribute)
        })
        component._attributes = attributeValues
    }

    static get(identifier) {
        if(isNaN(identifier) && typeof identifier === 'string') {
            return nameMap[identifier] || null
        }
        if(!isNaN(identifier)) {
            return idMap[+identifier] || null
        }
        return null
    }

    static getAll() {
        return componentList.slice(0)
    }

    static getAllPerGroup(group) {
        if(group instanceof Group) {
            let oldGroupValue = group
            group = Group.get(oldGroupValue)
            if(!group) {
                throw new ComponentException('Group ' + oldGroupValue + ' not found')
            }
        }
        if(!perGroup[group.id]) {
            return [];
        }
        return perGroup[group.id].slice(0)
    }

    static getAllPerAttribute(attribute) {
        if(attribute instanceof Attribute) {
            let oldAttributeValue = attribute
            attribute = Attribute.get(oldAttributeValue)
            if(!attribute) {
                throw new ComponentException('Attribute ' + oldAttributeValue + ' not found')
            }
        }
        if(!perAttribute[attribute.id]) {
            return [];
        }
        return perAttribute[attribute.id].slice(0)
    }

    static dumpFullData() {
        let data = Global.packString('CMP')
        let subData = Global.packInteger(componentList.length)
        componentList.forEach(component => {
            let componentData = component.dumpData()
            subData+= Global.packInteger(componentData.length)
            subData+= componentData
        })
        data+= Global.packInteger(subData.length)
        data+= subData
        return data
    }

}

export default Component