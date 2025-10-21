import operators from "./data/operators.json" with { type: "json" };
import class_map from "./data/map/class.json" with { type: "json" };
import subclass_map from "./data/map/subclass.json" with { type: "json" };
import faction_map from "./data/map/faction.json" with { type: "json" };

export const IMAGE_PATH_OPERATOR = "./images/operator/"
export const IMAGE_PATH_CLASS = "./images/class/"
export const IMAGE_PATH_SUBCLASS = "./images/subclass/"
export const IMAGE_PATH_FACTION = "./images/faction/"


export let operatorList = Object.keys(operators)

export {
    operators,
    class_map,
    subclass_map,
    faction_map
}

operatorList.sort((a, b) => {return operators[a].name.localeCompare(operators[b].name)})