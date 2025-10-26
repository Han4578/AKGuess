import { guessOperator } from "./main.js"
import * as data from "./globalData.js"

let suggestionListElement = document.querySelector(".suggestion-list")
let guessInput = document.querySelector("#guess")

let suggestionElements = new Map()
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
    e.stopPropagation()
})
guessInput.addEventListener("click", e => {
    showSuggestions()
    e.stopPropagation()
})

guessInput.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 13: //enter
            e.preventDefault()
            if (visibleSuggestions.length == 0 || !suggestionListElement.classList.contains("show")) return
            if (suggestionIndex == -1) {
                visibleSuggestions[0]?.click()
            } else visibleSuggestions[suggestionIndex].click()
            guessInput.value = ""
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
    const frag = document.createDocumentFragment()
    for (const id of data.operatorList) {    
        const suggestion = createSuggestionOperator(data.operators[id])

        suggestion.addEventListener("click", e => {
            hideSuggestions()
            guessOperator(id)
            guessInput.value = ""
            guessInput.focus()
            e.stopPropagation()
        })

        suggestionElements.set(id, suggestion)
        visibleSuggestions.push(suggestion)
        frag.appendChild(suggestion)
    }
    suggestionListElement.appendChild(frag)
} 

function createSuggestionOperator(operator) {
    let suggestion = document.createElement("div")
    suggestion.classList.add("suggestion")

    let icon = document.createElement("img")
    icon.src = data.IMAGE_PATH_OPERATOR + operator.icon
    icon.loading = "lazy"
    suggestion.appendChild(icon)

    let name = document.createElement("div")
    name.textContent = operator.name
    suggestion.appendChild(name)

    return suggestion
}


export function updateSuggestions() {
    visibleSuggestions = []
    suggestionIndex = -1
    for (const id of data.operatorList) {
        if (data.operators[id].search.some(t => t.includes(guessInput.value)) && !data.excludedOperators.has(id)) {
            suggestionElements.get(id).classList.remove("excluded")
            visibleSuggestions.push(suggestionElements.get(id))
        } else suggestionElements.get(id).classList.add("excluded")
    }
}

function showSuggestions() {
    suggestionListElement.classList.add("show")
}

function hideSuggestions() {
    suggestionListElement.classList.remove("show")
}