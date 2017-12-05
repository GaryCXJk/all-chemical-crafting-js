import { packInteger } from './Global'

/**
 * Content defines something that can be placed in a recipe.
 */
class Content {
    /**
     * 
     */
    constructor() {
        this._id = 0
        this._name = ''
        this._realName = ''
        this._description = ''
        this._order = 0
    }
    get id() {
        return this._id
    }
    get name() {
        return this._name
    }
    get realName() {
        return this._realName
    }
    get description() {
        return this._description
    }
    get order() {
        return this._order
    }

    compare(otherContent) {
        if((otherContent === null) || (typeof otherContent === 'undefined')) {
            return 1
        }
        if(
            this.id === otherContent.id &&
            this.name === otherContent.name &&
            this.realname === otherContent.realName &&
            this.description === otherContent.description &&
            this.order === otherContent.order
        ) {
            return 0
        }
        if(this.order !== otherContent.order) {
            return (this.order > otherContent.order ? 1 : -1)
        }
        if(this.id !== otherContent.id) {
            return (this.id > otherContent.id ? 1 : -1)
        }
        return 0
    }

    dumpData() {
        let data = ''
        data+= packInteger(this.id)
        data+= packInteger(this.name.length + 1, 1)
        data+= this.name
        data+= packInteger(0, 1)
        data+= packInteger(this.realName.length + 1, 1)
        data+= this.realName
        data+= packInteger(0, 1)
        data+= packInteger(this.description.length + 1, 1)
        data+= this.description
        data+= packInteger(0, 1)
        return data
    }
}

export default Content