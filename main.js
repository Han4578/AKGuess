import * as data from "./globalData.js";
import * as guessTable from "./guessTable.js";
import { addSuggestion, updateSuggestions } from "./suggestionList.js"
import { addToMenu, removeFromMenu, autoExclude, loadOperators } from "./operatorMenu.js";

const tooltipContainerTemplate = document.querySelector("#tooltip-container-template").content
const guessInput = document.querySelector("#guess-input")
const winContainer = document.querySelector("#win")
let hasWon = false

let operatorToGuess = data.operators.char_002_amiya

newGuess()
loadOperators()

document.querySelector("#new-round").addEventListener("click", newGuess)
document.querySelector("#win button").addEventListener("click", newGuess)

export function guessOperator(id) {
    if (hasWon) return
    const currentGuess = data.operators[id]
    const ans = data.operators[operatorToGuess]
    guessTable.insertOperatorRow(data.operators[id], operatorToGuess)

    if (id == operatorToGuess) {
        winContainer.classList.add("show")
        guessInput.disabled = true
        hasWon = true
    } else updateGainedInfo(currentGuess, ans)

    excludeOperator(id)
    autoExcludeOperators()
    updateSuggestions()
}

function newGuess() {
    hasWon = false
    const filteredList = data.operatorList.filter(o => data.settings.validateOperator(o))
    
    if (filteredList.length == 0) {
        alert("No operators match guess filters, a random operator was chosen instead")
        operatorToGuess = data.operatorList[Math.floor(Math.random() * data.operatorList.length)]
    } else operatorToGuess = filteredList[Math.floor(Math.random() * filteredList.length)]
    
    guessTable.clear()
    guessInput.disabled = false
    winContainer.classList.remove("show")
    guessInput.value = ""
    data.gainedInfo.reset()
    data.settings.apply()
    clearAllExcluded()
    autoExcludeOperators()
    updateSuggestions()
}

function updateGainedInfo(currentGuess, ans) {
    if (currentGuess.class == ans.class) data.gainedInfo.class = new Set([ans.class])
    else data.gainedInfo.class.delete(currentGuess.class)

    if (currentGuess.subclass == ans.subclass) data.gainedInfo.subclass = new Set([ans.subclass])
    else data.gainedInfo.subclass.delete(currentGuess.subclass)

    if (currentGuess.dp == ans.dp) {
        data.gainedInfo.dp = [ans.dp, ans.dp]
    } else if (currentGuess.dp < ans.dp) data.gainedInfo.dp[0] = Math.max(data.gainedInfo.dp[0], currentGuess.dp + 1)
    else data.gainedInfo.dp[1] = Math.min(data.gainedInfo.dp[1], currentGuess.dp - 1)

    if (currentGuess.rarity == ans.rarity) {
        data.gainedInfo.rarity.fill(false)
        data.gainedInfo.rarity[ans.rarity - 1] = true
    } else if (currentGuess.rarity < ans.rarity) data.gainedInfo.rarity.fill(false, 0, currentGuess.rarity)
    else data.gainedInfo.rarity.fill(false, currentGuess.rarity - 1)
        
    if (currentGuess.born == ans.born) data.gainedInfo.born = new Set([ans.born])
    else data.gainedInfo.born.delete(currentGuess.born)
        
    if (currentGuess.race == ans.race) data.gainedInfo.race = new Set([ans.race])
    else data.gainedInfo.race.delete(currentGuess.race)

    if (currentGuess.faction == ans.faction) data.gainedInfo.faction = new Set([ans.faction])
    else data.gainedInfo.faction.delete(currentGuess.faction)

    if (data.gainedInfo.faction.size == 1 || currentGuess.subfaction != "") {
        if (currentGuess.subfaction == ans.subfaction) data.gainedInfo.subfaction = new Set([ans.subfaction])
        else data.gainedInfo.subfaction.delete(currentGuess.subfaction)
    }

}

export function excludeOperator(id) {
    data.excludedOperators.add(id)
    removeFromMenu(id)
}

function clearAllExcluded() {
    data.excludedOperators.forEach(addToMenu)
    data.excludedOperators.clear()
}

export function includeOperator(id) {
    data.excludedOperators.delete(id)
    addToMenu(id)
    addSuggestion(id)
}

export function autoExcludeOperators() {
    if (!autoExclude) return;

    data.operatorList.forEach(id => {
        if (data.excludedOperators.has(id)) return
        const operator = data.operators[id]

        if (
            !data.gainedInfo.class.has(operator.class) ||
            !data.gainedInfo.subclass.has(operator.subclass) ||
            !data.gainedInfo.rarity[operator.rarity - 1] ||
            data.gainedInfo.dp[0] > operator.dp ||
            data.gainedInfo.dp[1] < operator.dp ||
            !data.gainedInfo.race.has(operator.race) ||
            !data.gainedInfo.born.has(operator.born) ||
            !data.gainedInfo.faction.has(operator.faction) ||
            !data.gainedInfo.subfaction.has(operator.subfaction)
        ) excludeOperator(id)
    })
}   

export function create_icon(path, tooltip = null) {
    const tooltipContainer = tooltipContainerTemplate.cloneNode(true).children[0]
    const image = document.createElement("img")

    image.classList.add("icon")
    image.src = path
    image.loading = "lazy"

    tooltipContainer.appendChild(image)
    if (tooltip != null) tooltipContainer.querySelector(".tooltip").textContent = tooltip

    return tooltipContainer
}