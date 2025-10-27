import { guessOperator } from "./main.js"
import * as data from "./globalData.js"

let suggestionListElement = document.querySelector(".suggestion-list")
let guessInput = document.querySelector("#guess")

let suggestionElements = new Map()
let visibleSuggestions = data.operatorList.slice()
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
                suggestionElements.get(visibleSuggestions[0])?.click()
            } else suggestionElements.get(visibleSuggestions[suggestionIndex]).click()
            guessInput.value = ""
            break
        case 38: //up
            e.preventDefault()
            if (visibleSuggestions.length == 0) return
            if (suggestionIndex == -1) {
                suggestionIndex = visibleSuggestions.length - 1
            } else {
                suggestionElements.get(visibleSuggestions[suggestionIndex]).classList.remove("selected")
                suggestionIndex = ((suggestionIndex - 1) + visibleSuggestions.length) % visibleSuggestions.length
            }
            
            suggestionElements.get(visibleSuggestions[suggestionIndex]).scrollIntoView({block: "nearest"})
            suggestionElements.get(visibleSuggestions[suggestionIndex]).classList.add("selected")
            break
        case 40: //down
            e.preventDefault()
            if (visibleSuggestions.length == 0) return

            if (suggestionIndex == -1) {
                suggestionIndex = 0
            } else {
                suggestionElements.get(visibleSuggestions[suggestionIndex]).classList.remove("selected")
                suggestionIndex = (suggestionIndex + 1) % visibleSuggestions.length
            }

            suggestionElements.get(visibleSuggestions[suggestionIndex]).classList.add("selected")
            suggestionElements.get(visibleSuggestions[suggestionIndex]).scrollIntoView({block: "nearest"})
            break
    }
})

async function loadSuggestions() {
    const frag = document.createDocumentFragment()
    for (const id of data.operatorList) {    
        const suggestion = createSuggestionOperator(data.operators[id])

        suggestion.addEventListener("click", e => {
            suggestionIndex = -1
            hideSuggestions()
            guessInput.value = ""
            guessOperator(id)
            guessInput.focus()
            e.stopPropagation()
        })

        suggestionElements.set(id, suggestion)
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
    suggestionIndex = -1
    if (guessInput.value.length == 0 && data.excludedOperators.size == 0) {
        visibleSuggestions = data.operatorList.slice()
        suggestionElements.forEach(e => e.classList.remove("excluded"))
    }else {    
        visibleSuggestions = []
        for (const id of data.operatorList) {
            if (data.operators[id].search.some(t => t.includes(guessInput.value)) && !data.excludedOperators.has(id)) {
                suggestionElements.get(id).classList.remove("excluded")
                visibleSuggestions.push(id)
            } else suggestionElements.get(id).classList.add("excluded")
        }
    }
}

export function addSuggestion(id) {
    suggestionElements.get(id).classList.remove("excluded")
    visibleSuggestions.splice(binarySearch(id), 0, id)
}

export function removeSuggestion(id) {
    suggestionElements.get(id).classList.add("excluded")
    visibleSuggestions.splice(binarySearch(id), 1)
}

function showSuggestions() {
    suggestionListElement.classList.add("show")
}

function hideSuggestions() {
    suggestionListElement.classList.remove("show")
}

function binarySearch(id) {
    let low = 0, high = visibleSuggestions.length - 1, ans = visibleSuggestions.length
    const name = data.operators[id].name

    while (low <= high) {
        const middle = (low + high) >> 1

        if (data.operators[visibleSuggestions[middle]].name.localeCompare(name) >= 0) {
            ans = middle
            high = middle - 1
        } else {
            low = middle + 1
        }
    }
    
    return ans
}
