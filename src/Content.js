import * as Global from './Global';

/**
 * Content defines something that can be placed in a recipe.
 */
export default class Content {
  /**
     *
     */
  constructor() {
    this.id = 0;
    this.name = '';
    this.realName = '';
    this.description = '';
    this.order = 0;
  }

  compare(otherContent) {
    if ((otherContent === null) || (typeof otherContent === 'undefined')) {
      return 1;
    }
    if (
      this.id === otherContent.id
            && this.name === otherContent.name
            && this.realname === otherContent.realName
            && this.description === otherContent.description
            && this.order === otherContent.order
    ) {
      return 0;
    }
    if (this.order !== otherContent.order) {
      return (this.order > otherContent.order ? 1 : -1);
    }
    if (this.id !== otherContent.id) {
      return (this.id > otherContent.id ? 1 : -1);
    }
    return 0;
  }

  dumpData() {
    let data = '';
    const name = Global.packString(this.name);
    const realName = Global.packString(this.realName);
    const description = Global.packString(this.description);
    data += Global.packInteger(this.id);
    data += Global.packInteger(name.length, 1);
    data += name;
    data += Global.packInteger(realName.length, 1);
    data += realName;
    data += Global.packInteger(description.length, 1);
    data += description;
    return data;
  }
}
