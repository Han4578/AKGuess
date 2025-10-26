import * as data from "./globalData.js";
import * as guessTable from "./guessTable.js";
import { updateSuggestions } from "./suggestionList.js"
import { autoExcludeOperators, clearAllExcluded, excludeOperator } from "./operatorMenu.js";

let guessInput = document.querySelector("#guess")
let winContainer = document.querySelector("#win")
let winButton = document.querySelector("#win button")

let operatorToGuess = data.operatorList[Math.floor(Math.random() * data.operatorList.length)]

winButton.addEventListener("click", newGuess)

export function guessOperator(id) {
    const currentGuess = data.operators[id]
    const ans = data.operators[operatorToGuess]
    guessTable.insertOperatorRow(data.operators[id], operatorToGuess)

    if (id == operatorToGuess) {
        winContainer.classList.add("show")
        guessInput.disabled = true
    } else {
        
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

    excludeOperator(id)
    autoExcludeOperators()
    updateSuggestions()
}

function newGuess() {
    operatorToGuess = data.operatorList[Math.floor(Math.random() * data.operatorList.length)]
    guessTable.clear()
    guessInput.disabled = false
    winContainer.classList.remove("show")
    guessInput.value = ""
    clearAllExcluded()
    updateSuggestions()
    data.gainedInfo.reset()
}