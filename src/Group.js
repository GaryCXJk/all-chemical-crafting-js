import Content from './Content'
import * as Global from './Global'

const idMap = {}
const nameMap = {}
const groupList = []

let groupId = 1

export function GroupException(message) {
    this.message = message
    this.name = 'GroupException'
}

export function GroupParseException(message) {
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
        let parent = this._parent
        let data = super.dumpData()
        data+= Global.packInteger(this.color, 3, true)
        data+= Global.packInteger(parent === null ? 0 : 1, 1)
        if(parent !== null) {
            data+= Global.packInteger(parent.id)
        }
        return data
    }

    static add(name, realName = null, properties = {}) {
        if(nameMap[name]) {
            throw new GroupException('Group already defined')
        }
        let id
        let description = properties.description || ''
        let color = properties.color || 0x555555
        let parent = properties.parent || null
        if(properties.id) {
            id = properties.id
        } else {
            id = groupId++
            while(idMap.hasOwnProperty(id)) {
                id = groupId++
            }
        }
        if(!realName) {
            realName = name
        }
        let group = new Group(id, name, realName, description, color)
        group.parent = parent
        return group
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
        let data = Global.packString('GRP')
        let subData = Global.packInteger(groupList.length)
        groupList.forEach(group => {
            let groupData = group.dumpData()
            subData+= Global.packInteger(groupData.length)
            subData+= groupData
        })
        data+= Global.packInteger(subData.length)
        data+= subData
        return data
    }

    static parseData(data) {
        if(!Global.unpackString(data.slice(0, 4)) !== 'GRP') {
            throw new GroupParseException('No valid group data - Header mismatch')
        }
        let subDataSize = data.slice(4, 8)
        let subData = data.slice(8, 8 + subDataSize)
        let groupListLength = subData.slice(0, 4)
    }
}

export default Group