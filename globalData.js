import operators from "./data/operators.json" with { type: "json" };
import class_map from "./data/map/class.json" with { type: "json" };
import subclass_map from "./data/map/subclass.json" with { type: "json" };
import faction_map from "./data/map/faction.json" with { type: "json" };
import faction_subfaction from "./data/map/faction_subfaction.json" with { type: "json" };

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
    rarity: new Array(6).fill(true),
    born: new Set(),
    race: new Set(),
    faction: new Set(),
    subfaction: new Set(),

    reset() {
        this.class = new Set(Object.keys(class_map))
        this.subclass = new Set(Object.keys(subclass_map))
        this.dp = [1, 99],
        this.rarity = new Array(6).fill(true),
        this.born = new Set(Object.values(operators).map(o => o.born))
        this.race = new Set(Object.values(operators).map(o => o.race))
        this.faction = new Set(Object.keys(faction_subfaction))
        this.subfaction = new Set(Object.values(faction_subfaction).flat())
    }
}

export const settings = {
    fields: {
        class: new Set(),
        rarity: new Array(6),
        faction: new Set(),
    },
    
    reset() {
        this.fields.class = new Set(Object.keys(class_map)),
        this.fields.rarity = new Array(6).fill(true),
        this.fields.faction = new Set(Object.keys(faction_subfaction))
    },

    update(changes) {
        this.fields.rarity = changes.rarity
        this.fields.class = changes.class
        this.fields.faction = changes.faction
        
        localStorage.setItem("settings", JSON.stringify({
            rarity: this.fields.rarity,
            class: [...this.fields.class],
            faction: [...this.fields.faction]
        }))
    },

    duplicate() {
        return structuredClone(this.fields)
    },
    
    load() {
        const saved = localStorage.getItem("settings")
        if (saved == null) this.reset()
        else {
            const obj = JSON.parse(saved)
            this.fields.rarity = obj.rarity
            this.fields.class = new Set(obj.class)
            this.fields.faction = new Set(obj.faction)
        }
    },

    apply() {   
        gainedInfo.rarity = [...this.fields.rarity]
        gainedInfo.class = new Set(this.fields.class)
        gainedInfo.faction = new Set(this.fields.faction)
    },

    validateOperator(id) {
        const operator = operators[id]
        return this.fields.rarity[operator.rarity - 1] && this.fields.class.has(operator.class) && this.fields.faction.has(operator.faction)
    }
}

export {
    operators,
    class_map,
    subclass_map,
    faction_map,
    faction_subfaction
}

settings.load()
gainedInfo.reset()