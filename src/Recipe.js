import Content from './Content';

const recipeList = {};
const idTemplateMap = {};
const nameTemplateMap = {};
const priorityMap = {};

export default class Recipe {
  static addTemplate(id, name, recipe, priority) {
    idTemplate[id] = recipe;
    idTemplate[name] = recipe;
    priorityMap[name] = priority;
  }
}
