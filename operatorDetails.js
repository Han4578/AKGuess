import * as data from "./globalData.js"
import { excludeOperator, guessOperator, includeOperator } from "./main.js"

const element = {
    name: document.querySelector("#operator-details-name"),
    icon: document.querySelector("#operator-details-icon"),
    classIcon: document.querySelector("#operator-details-class-icon"),
    class: document.querySelector("#operator-details-class"),
    subclassIcon: document.querySelector("#operator-details-subclass-icon"),
    subclass: document.querySelector("#operator-details-subclass"),
    rarity: document.querySelector("#operator-details-rarity"),
    dp: document.querySelector("#operator-details-dp"),
    born: document.querySelector("#operator-details-born"),
    race: document.querySelector("#operator-details-race"),
    factionIcon: document.querySelector("#operator-details-faction-icon"),
    faction: document.querySelector("#operator-details-faction"),
    parentFactionIcon: document.querySelector("#operator-details-faction-icon-2"),
    parentFaction: document.querySelector("#operator-details-faction-2"),
}

const operatorDetails = document.querySelector("#operator-details")
const partOf = document.querySelector("#part-of")
const inOrExcludeButton = document.querySelector("#in-or-exclude")
const frame = document.querySelector(".frame")

let currentID = ""

document.querySelector("#operator-details-grid").addEventListener("click", e => e.stopPropagation())
operatorDetails.addEventListener("click", closeDetails)
document.querySelector("#close-details").addEventListener("click", closeDetails)

inOrExcludeButton.addEventListener("click", () => {
    if (data.excludedOperators.has(currentID)) includeOperator(currentID)
    else excludeOperator(currentID)
    closeDetails()
})

document.querySelector("#guess").addEventListener("click", () => {
    guessOperator(currentID)
    closeDetails()
    if (window.innerWidth <= 800) frame.classList.remove("show-menu")
})

export function openDetails(id) {
    const operator = data.operators[id]
    currentID = id

    element.name.textContent = operator.name
    element.icon.src = data.IMAGE_PATH_OPERATOR + operator.icon
    element.class.textContent = data.class_map[operator.class].name
    element.classIcon.src = data.IMAGE_PATH_CLASS + data.class_map[operator.class].icon
    element.subclass.textContent = data.subclass_map[operator.subclass].name
    element.subclassIcon.src = data.IMAGE_PATH_SUBCLASS + data.subclass_map[operator.subclass].icon
    element.rarity.textContent = operator.rarity
    element.dp.textContent = operator.dp
    element.born.textContent = operator.born
    element.race.textContent = operator.race
    element.faction.textContent = data.faction_map[operator.faction[operator.faction.length - 1]].name
    element.factionIcon.src = data.IMAGE_PATH_FACTION + data.faction_map[operator.faction[operator.faction.length - 1]].icon
    if (operator.faction.length > 1) {
        element.parentFaction.textContent = data.faction_map[operator.faction[0]].name
        element.parentFactionIcon.src = data.IMAGE_PATH_FACTION + data.faction_map[operator.faction[0]].icon
        partOf.classList.add("show")
    } else partOf.classList.remove("show")

    if (data.excludedOperators.has(id)) {
        inOrExcludeButton.classList.add("include")
        inOrExcludeButton.textContent = "Include"
    }
    else {
        inOrExcludeButton.classList.remove("include")
        inOrExcludeButton.textContent = "Exclude"
    }

    operatorDetails.classList.add("show")
}

function closeDetails() {
    operatorDetails.classList.remove("show")
}