import * as data from "./globalData.js"
//sort ops, batch exclude, guess or exclude

let frame = document.querySelector(".frame")
let operatorMenu = document.querySelector(".operator-menu")
let listButton = document.querySelector("#list-button")
let menuElements = {}

frame.addEventListener("click", hideMenu)
listButton.addEventListener("click", e => {
    showMenu()
    e.stopPropagation()
})
operatorMenu.addEventListener("click", e => e.stopPropagation())

loadOperators()

export function showMenu() {
    frame.classList.add("show-menu")
}

function hideMenu() {
    frame.classList.remove("show-menu")
}

async function loadOperators() {
    for (const id of data.operatorList) {
        const operator = data.operators[id]
        const element = document.createElement("div")
        element.classList.add("menu-item")
        element.classList.add("center")

        const icon = document.createElement("img")
        icon.src = data.IMAGE_PATH_OPERATOR + operator.icon
        icon.loading = "lazy"
        element.appendChild(icon)

        let tip = document.createElement("div")
        tip.textContent = operator.name
        tip.classList.add("tooltip")
        element.appendChild(tip)
        
        operatorMenu.appendChild(element)
        menuElements[id] = element
    }
}