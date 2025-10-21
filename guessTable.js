import * as data from "./globalData.js"

let guessTable = document.querySelector(".guess-table .guess-slot:last-child")
let slots = []

export function insertOperatorRow(operator, operatorToGuess) {
    let ans = data.operators[operatorToGuess]

    validateFaction(insertImageSlot(data.IMAGE_PATH_FACTION, data.faction_map[operator.faction[operator.faction.length - 1]]), operator.faction, ans.faction)
    validateSlot(insertGuessSlot(operator.race), operator.race, ans.race)
    validateSlot(insertGuessSlot(operator.born), operator.born, ans.born)
    validateNumber(insertGuessSlot(operator.dp), operator.dp, ans.dp)
    validateNumber(insertGuessSlot(operator.rarity), operator.rarity, ans.rarity)
    validateSlot(insertImageSlot(data.IMAGE_PATH_SUBCLASS, data.subclass_map[operator.subclass]), operator.subclass, ans.subclass)
    validateSlot(insertImageSlot(data.IMAGE_PATH_CLASS, data.class_map[operator.class]), operator.class, ans.class)
    insertGuessSlot(operator.name)
    insertImageSlot(data.IMAGE_PATH_OPERATOR, operator)
}

export function clear() {
    for (const slot of slots) {
        slot.remove()
    }
    slots = []
}

function insertImageSlot(path, obj) {
    let image = document.createElement("img")

    image.classList.add("icon")
    image.src = path + obj.icon
    image.loading = "lazy"
    return insertGuessSlot(image, obj.name)
}

function insertGuessSlot(content, tooltip = null) {
    let slot = document.createElement("div")

    slot.classList.add("guess-slot")
    slot.append(content)

    if (tooltip != null) {
        let tip = document.createElement("div")
        tip.textContent = tooltip
        tip.classList.add("tooltip")
        slot.appendChild(tip)
    }
    guessTable.after(slot)
    slots.push(slot)
    return slot
}

function validateSlot(slot, a, b) {
    slot.classList.add((a == b)? "correct": "wrong")
}

function validateFaction(slot, a, b) {
    if (a[a.length - 1] == b[b.length - 1]) {
        slot.classList.add("correct")
    } else if (a[0] == b[0]) {
        slot.classList.add("kinda")
    } else {
        slot.classList.add("wrong")
    }
}

function validateNumber(slot, a, b) {
    if (a == b) { 
        slot.classList.add("correct")
    } else {
        slot.classList.add("wrong")
        slot.textContent += (a < b)? "↑": "↓"
    }
}