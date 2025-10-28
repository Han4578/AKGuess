import * as data from "./globalData.js";
import * as guessTable from "./guessTable.js";
import { addSuggestion, removeSuggestion, updateSuggestions } from "./suggestionList.js"
import { addToMenu, removeFromMenu, autoExclude } from "./operatorMenu.js";

let guessInput = document.querySelector("#guess-input")
let winContainer = document.querySelector("#win")
let winButton = document.querySelector("#win button")
let hasWon = false

let operatorToGuess = data.operatorList[Math.floor(Math.random() * data.operatorList.length)]

winButton.addEventListener("click", newGuess)

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
    operatorToGuess = data.operatorList[Math.floor(Math.random() * data.operatorList.length)]
    guessTable.clear()
    guessInput.disabled = false
    winContainer.classList.remove("show")
    guessInput.value = ""
    clearAllExcluded()
    updateSuggestions()
    data.gainedInfo.reset()
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
        data.gainedInfo.rarity = [ans.rarity, ans.rarity]
    } else if (currentGuess.rarity < ans.rarity) data.gainedInfo.rarity[0] = Math.max(data.gainedInfo.rarity[0], currentGuess.rarity + 1)
    else data.gainedInfo.rarity[1] = Math.min(data.gainedInfo.rarity[1], currentGuess.rarity - 1)
        
    if (currentGuess.born == ans.born) data.gainedInfo.born = new Set([ans.born])
    else data.gainedInfo.born.delete(currentGuess.born)
        
    if (currentGuess.race == ans.race) data.gainedInfo.race = new Set([ans.race])
    else data.gainedInfo.race.delete(currentGuess.race)

    if (currentGuess.faction[currentGuess.faction.length - 1] == ans.faction[ans.faction.length - 1]) data.gainedInfo.faction = new Set([ans.faction[ans.faction.length - 1]])
    else if (currentGuess.faction[0] == ans.faction[0]) {
        data.gainedInfo.faction = new Set([ans.faction[ans.faction.length - 1]])
        data.gainedInfo.excludedFaction.add(currentGuess.faction[currentGuess.faction.length - 1])
    }
    else data.gainedInfo.faction.delete(currentGuess.faction[0])
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
            data.gainedInfo.rarity[0] > operator.rarity ||
            data.gainedInfo.rarity[1] < operator.rarity ||
            data.gainedInfo.dp[0] > operator.dp ||
            data.gainedInfo.dp[1] < operator.dp ||
            !data.gainedInfo.race.has(operator.race) ||
            !data.gainedInfo.born.has(operator.born) ||
            !(
                operator.faction.some(o => data.gainedInfo.faction.has(o)) &&
                !data.gainedInfo.excludedFaction.has(operator.faction[operator.faction.length - 1])
            )
        ) excludeOperator(id)
    })
}   