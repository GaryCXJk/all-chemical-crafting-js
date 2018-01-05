import Content from './Content'
import * as Global from './Global'

const idMap = {}
const nameMap = {}
const groupList = []

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
}