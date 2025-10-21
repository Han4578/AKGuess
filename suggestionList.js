import { guessOperator } from "./main.js"
import * as data from "./globalData.js"

let suggestionListElement = document.querySelector(".suggestion-list")
let guessInput = document.querySelector("#guess")

let suggestionElements = {}
let visibleSuggestions = []
let suggestionIndex = -1

loadSuggestions()

for (const operator of Object.values(data.operators)) {
    operator.search = [operator.name.replaceAll(/\W/g, "").toLowerCase(), operator.name.toLowerCase()]
}

document.addEventListener("click", hideSuggestions)

guessInput.addEventListener("input", e => {
    updateSuggestions()
    showSuggestions()
})
guessInput.addEventListener("click", e => {
    showSuggestions()
    e.stopPropagation()
})

guessInput.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 13:
            e.preventDefault()
            if (visibleSuggestions.length == 0) return
            if (suggestionIndex == -1) {
                visibleSuggestions[0]?.click()
            } else visibleSuggestions[suggestionIndex].click()
            guessInput.value = ""
            updateSuggestions()
            break
        case 38: //up
            e.preventDefault()
            if (visibleSuggestions.length == 0) return
            if (suggestionIndex == -1) {
                suggestionIndex = visibleSuggestions.length - 1
            } else {
                visibleSuggestions[suggestionIndex].classList.remove("selected")
                suggestionIndex = ((suggestionIndex - 1) + visibleSuggestions.length) % visibleSuggestions.length
            }
            
            visibleSuggestions[suggestionIndex].scrollIntoView({block: "nearest"})
            visibleSuggestions[suggestionIndex].classList.add("selected")
            break
        case 40: //down
            e.preventDefault()
            if (visibleSuggestions.length == 0) return

            if (suggestionIndex == -1) {
                suggestionIndex = 0
            } else {
                visibleSuggestions[suggestionIndex].classList.remove("selected")
                suggestionIndex = (suggestionIndex + 1) % visibleSuggestions.length
            }

            visibleSuggestions[suggestionIndex].classList.add("selected")
            visibleSuggestions[suggestionIndex].scrollIntoView({block: "nearest"})
            break
    }
})

async function loadSuggestions() {
    for (const id of data.operatorList) {    
        const suggestion = insertSuggestionOperator(data.operators[id])

        suggestion.addEventListener("click", () => {
            guessOperator(id)
        })

        suggestionElements[id] = suggestion
        visibleSuggestions.push(suggestion)
    }
} 

function insertSuggestionOperator(operator) {
    let suggestion = document.createElement("div")
    suggestion.classList.add("suggestion")

    let icon = document.createElement("img")
    icon.src = data.IMAGE_PATH_OPERATOR + operator.icon
    icon.loading = "lazy"
    suggestion.appendChild(icon)

    let name = document.createElement("div")
    name.textContent = operator.name
    suggestion.appendChild(name)

    suggestionListElement.appendChild(suggestion)
    return suggestion
}


export function updateSuggestions() {
    visibleSuggestions = []
    suggestionIndex = -1
    for (const id of data.operatorList) {
        if (data.operators[id].search.some(t => t.includes(guessInput.value))) {
            suggestionElements[id].style.display ="flex"
            visibleSuggestions.push(suggestionElements[id])
        } else suggestionElements[id].style.display ="none"
    }
}

function showSuggestions() {
    suggestionListElement.classList.add("show")
}

function hideSuggestions() {
    suggestionListElement.classList.remove("show")
}