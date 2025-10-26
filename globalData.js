import operators from "./data/operators.json" with { type: "json" };
import class_map from "./data/map/class.json" with { type: "json" };
import subclass_map from "./data/map/subclass.json" with { type: "json" };
import faction_map from "./data/map/faction.json" with { type: "json" };

export const IMAGE_PATH_OPERATOR = "./images/operator/"
export const IMAGE_PATH_CLASS = "./images/class/"
export const IMAGE_PATH_SUBCLASS = "./images/subclass/"
export const IMAGE_PATH_FACTION = "./images/faction/"


export const operatorList = Object.keys(operators)
export const excludedOperators = new Set()
export const gainedInfo = {
    class: new Set(),
    subclass: new Set(),
    dp: [1, 99],
    rarity: [1, 6],
    born: new Set(),
    race: new Set(),
    faction: new Set(),
    excludedFaction: new Set(),

    reset() {
        this.class = new Set(Object.keys(class_map))
        this.subclass = new Set(Object.keys(subclass_map))
        this.dp = [1, 99],
        this.rarity = [1, 6],
        this.born = new Set(Object.values(operators).map(o => o.born))
        this.race = new Set(Object.values(operators).map(o => o.race))
        this.faction = new Set(Object.keys(faction_map))
        this.excludedFaction.clear()
    }
}

export {
    operators,
    class_map,
    subclass_map,
    faction_map
}

operatorList.sort((a, b) => {return operators[a].name.localeCompare(operators[b].name)})
gainedInfo.reset()