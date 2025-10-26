import * as data from "./globalData.js";
import * as guessTable from "./guessTable.js";
import { updateSuggestions } from "./suggestionList.js"
import { clearAllExcluded, excludeOperator } from "./operatorMenu.js";

let guessInput = document.querySelector("#guess")
let winContainer = document.querySelector("#win")
let winButton = document.querySelector("#win button")

let operatorToGuess = data.operatorList[Math.floor(Math.random() * data.operatorList.length)]

winButton.addEventListener("click", newGuess)

export function guessOperator(id) {
    guessTable.insertOperatorRow(data.operators[id], operatorToGuess)

    if (id == operatorToGuess) {
        winContainer.classList.add("show")
        guessInput.disabled = true
    } 

    excludeOperator(id)
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
}