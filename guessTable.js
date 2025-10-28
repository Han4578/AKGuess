import * as data from "./globalData.js"

let guessTable = document.querySelector(".guess-table .guess-slot:last-child")
const tooltipContainerTemplate = document.querySelector("#tooltip-container-template").content
let slots = []
let delay = 0
const delayIncrement = 100

export function insertOperatorRow(operator, operatorToGuess) {
    const ans = data.operators[operatorToGuess]
    const frag = document.createDocumentFragment()
    delay = 0
    
    insertImageSlot(frag, data.IMAGE_PATH_OPERATOR, operator)
    insertGuessSlot(frag, operator.name)
    validateSlot(insertImageSlot(frag, data.IMAGE_PATH_CLASS, data.class_map[operator.class]), operator.class, ans.class)
    validateSlot(insertImageSlot(frag, data.IMAGE_PATH_SUBCLASS, data.subclass_map[operator.subclass]), operator.subclass, ans.subclass)
    validateNumber(insertGuessSlot(frag, operator.rarity), operator.rarity, ans.rarity)
    validateNumber(insertGuessSlot(frag, operator.dp), operator.dp, ans.dp)
    validateSlot(insertGuessSlot(frag, operator.born), operator.born, ans.born)
    validateSlot(insertGuessSlot(frag, operator.race), operator.race, ans.race)
    validateFaction(insertImageSlot(frag, data.IMAGE_PATH_FACTION, data.faction_map[operator.faction[operator.faction.length - 1]]), operator.faction, ans.faction)


    guessTable.after(frag)
}

export function clear() {
    for (const slot of slots) {
        slot.remove()
    }
    slots = []
}

function insertImageSlot(fragment, path, obj) {
    let image = document.createElement("img")

    image.classList.add("icon")
    image.src = path + obj.icon
    image.loading = "lazy"
    return insertGuessSlot(fragment, image, obj.name)
}

function insertGuessSlot(fragment, content, tooltip = null) {
    const slot = tooltipContainerTemplate.cloneNode(true).children[0]

    slot.classList.add("guess-slot")
    slot.classList.add("flip")
    slot.append(content)
    slot.querySelector(".tooltip").textContent = tooltip

    fragment.appendChild(slot)
    slots.push(slot)
    setTimeout(() => {slot.classList.add("start")}, delay)
    delay += delayIncrement
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