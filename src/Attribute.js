import Content from './Content'
import * as Global from './Global'

const idMap = {}
const nameMap = {}
const attributeList = []

const attributeId = 1

function AttributeParseException(message) {
    this.message = message
    this.name = 'AttributeParseException'
}

class Attribute extends Content {
    constructor(id, name, realName, description) {
        super()
        this._id = id
        this._name = name
        this._realName = realName
        this._description = description
        this._order = 2
        idMap[+id] = this
        nameMap[name] = this
        attributeList.push(this)
    }
    
    static add(name, realName = null, properties = {}) {
        let id
        let description = properties.description || ''
        if(properties.id) {
            id = properties.id
        } else {
            id = attributeId++
            while(idMap.hasOwnProperty(id)) {
                id = attributeId++
            }
        }
        if(!realName) {
            realName = name
        }
        return new Attribute(id, name, realName, description)
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
        return attributeList.slice(0)
    }

    static dumpFullData() {
        let data = Global.packString('ATT')
        let subData = Global.packInteger(attributeList.length)
        attributeList.forEach(attribute => {
            let attributeData = attribute.dumpData()
            subData+= Global.packInteger(attributeData.length)
            subData+= attributeData
        })
        data+= Global.packInteger(subData.length)
        data+= subData
        return data
    }

}