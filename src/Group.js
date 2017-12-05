import Content from './Content'
import { packInteger } from './Global'

let idMap = {}
let nameMap = {}
let groupList = []

function GroupParseException(message) {
    this.message = message
    this.name = 'GroupParseException'
}

class Group extends Content {
    constructor(id, name, realName, description, color = 0x555555) {
        super()
        this._id = id
        this._name = name
        this._realName = realName
        this._description = description
        this._order = 1
        this._color = color
        this._parent = null
        this._children = []
        idMap[+id] = this
        nameMap[name] = this
        groupList.push(this)
    }

    get parent() {
        return this._parent
    }

    set parent(parent) {
        if(parent !== null) {
            if(isNaN(parent) && typeof parent === 'string') {
                if(nameMap[parent]) {
                    parent = nameMap[parent]
                } else {
                    parent = null
                }
            } else if(!isNaN(parent)) {
                if(idMap[+parent]) {
                    parent = idMap[+parent]
                } else {
                    parent = null
                }
            }
            if(parent !== null) {
                this._parent = parent
                parent.addChild(this)
            }
        }
    }

    get children() {
        return this._children.slice(0)
    }

    addChild(group) {
        if(this._children.indexOf(group) === -1) {
            this._children.push(group)
        }
    }

    dumpData() {
        let parent = this.parent
        let data = super.dumpData()
        data+= this.packInteger(this.color, 3, true)
        data+= this.packInteger(parent === null ? 0 : 1, 1)
        if(parent !== null) {
            data+= this.packInteger(parent.id)
        }
        return data
    }

    static add(id, name, properties) {
        let realName = properties.realName || name
        let description = properties.description || ''
        let color = properties.color || 0x555555
        let parent = properties.parent || null
        let group = new Group(id, name, realName, description, color)
        group.parent = parent
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
        return groupList.slice(0)
    }

    static dumpFullData() {
        let data = 'GRP'
        data+= packInteger(0, 1)
        let subData = packInteger(groupList.length)
        groupList.forEach(group => {
            let groupData = group.dumpData()
            subData+= packInteger(groupData.length)
            subData+= groupData
        })
        data+= packInteger(subData.length)
        data+= subData
        return data
    }

    static parseData(data) {
        if(!data.slice(0, 4) !== 'GRP' + packInteger(0, 1)) {
            throw new GroupParseException('No valid group data - Header mismatch')
        }
        let subDataSize = data.slice(4, 8)
        let subData = data.slice(8, 8 + subDataSize)
        let groupListLength = subData.slice(0, 4)
    }
}

export default Group