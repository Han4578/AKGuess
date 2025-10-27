import * as data from "./globalData.js"
import class_subclass from "./data/map/class-subclass.json" with { type: "json" };
import { excludeOperator, includeOperator, autoExcludeOperators } from "./main.js";

//sort ops, batch exclude, guess or exclude

const frame = document.querySelector(".frame")
const operatorMenu = document.querySelector(".operator-menu")
const operatorContainer = document.querySelector(".operator-container")
const sortInput = document.querySelector("#operator-sort")
const sectionTemplate = document.querySelector("#section-template")
const tooltipContainerTemplate = document.querySelector("#tooltip-container-template").content
const menuElements = new Map()
const elementGrid = new Map()

let showExcluded = false
let autoExclude = true

let batchExcludeMode = false
let batchExcludeSelected = new Set()

sortInput.addEventListener("change", () => displayOperators(sortInput.value))
document.querySelector("#list-button").addEventListener("click", e => {
    frame.classList.toggle("show-menu")
    e.stopPropagation()
})

document.querySelector("#reverse-sort").addEventListener("click", () => operatorContainer.classList.toggle("reverse"))
document.querySelector("#close-menu").addEventListener("click", () => frame.classList.toggle("show-menu"))
document.querySelector("#show-excluded").addEventListener("input", () => {
    showExcluded = !showExcluded
    if (showExcluded) {
        for (const id of data.excludedOperators) elementGrid.get(id).appendChild(menuElements.get(id))
        } else {
        for (const id of data.excludedOperators) menuElements.get(id).remove()
    }
})
document.querySelector("#auto-exclude").addEventListener("input", () => {
    autoExclude = !autoExclude
    if (autoExclude) autoExcludeOperators()
})
document.querySelector("#batch-exclude-confirm").addEventListener("click", e => {
    for (const id of batchExcludeSelected) excludeOperator(id)
    toggleBatchExclude()
})
document.querySelector("#batch-exclude-cancel").addEventListener("click", () => toggleBatchExclude())
document.querySelector("#batch-exclude").addEventListener("click", () => toggleBatchExclude())

loadOperators().then(() => {
    displayOperators()
})

async function loadOperators() {
    for (const id of data.operatorList) {
        const operator = data.operators[id]
        const icon = create_icon(data.IMAGE_PATH_OPERATOR + operator.icon, operator.name)
        icon.classList.add("menu-item")
        icon.classList.add("center")
        icon.addEventListener("click", () => {
            if (batchExcludeMode) {
                if (batchExcludeSelected.has(id)) {
                    batchExcludeSelected.delete(id)
                    icon.classList.remove("selected")
                } else {
                    batchExcludeSelected.add(id)
                    icon.classList.add("selected")
                }
            }
        })
        menuElements.set(id, icon)
    }
}

function displayOperators(type = "name") {
    const frag = document.createDocumentFragment()
    let groups;
    switch (type) {
        case "name":
            groups = Map.groupBy(data.operatorList, id => data.operators[id].name[0])
            for (const [k, v] of groups.entries()) {
                frag.appendChild(displaySection(k, v))
            }
            break;
        case "class":
            groups = Map.groupBy(data.operatorList, id => data.operators[id].subclass)

            for (const [class_id, subclasses] of Object.entries(class_subclass)) {
                const class_icon = create_icon(data.IMAGE_PATH_CLASS + data.class_map[class_id].icon, data.class_map[class_id].name)
                
                for (const subclass of subclasses) {
                    if (!groups.has(subclass)) continue
                    const subclass_icon = create_icon(data.IMAGE_PATH_SUBCLASS + data.subclass_map[subclass].icon, data.subclass_map[subclass].name)
                    const titleFrag = document.createDocumentFragment()
                    titleFrag.appendChild(class_icon.cloneNode(true))
                    titleFrag.appendChild(subclass_icon)
                    titleFrag.append(data.subclass_map[subclass].name)
                    
                    frag.appendChild(displaySection(titleFrag, groups.get(subclass)))
                }
            }
            break;
        case "rarity":
            groups = Map.groupBy(data.operatorList, id => data.operators[id].rarity)
            for (let rarity = 6; rarity >= 1; --rarity) {
                frag.appendChild(displaySection(rarity, groups.get(rarity)))
            }
            break;
        default:
            break;
    }
    operatorContainer.replaceChildren(frag)
}

function displaySection(titleContent, content) {
    const section = sectionTemplate.content.cloneNode(true).querySelector(".operator-section")
    let order = 1

    section.querySelector(".operator-section-title").append(titleContent)

    const grid = section.querySelector(".operator-grid")

    for (const id of content) {
        menuElements.get(id).style.order = order++
        if (showExcluded || !data.excludedOperators.has(id)) grid.appendChild(menuElements.get(id))
        elementGrid.set(id, grid)
    }

    return section
}

function toggleBatchExclude() {
    batchExcludeMode = !batchExcludeMode
    if (batchExcludeMode) operatorMenu.classList.add("exclude-mode")
        else {
        operatorMenu.classList.remove("exclude-mode")
        for (const id of batchExcludeSelected) menuElements.get(id).classList.remove("selected")
    }
    batchExcludeSelected.clear()
}

export function removeFromMenu(id) {
    menuElements.get(id).classList.add("excluded")
    if (!showExcluded) menuElements.get(id).remove()
}

export function addToMenu(id) {
    menuElements.get(id).classList.remove("excluded")
    elementGrid.get(id).appendChild(menuElements.get(id))
}

function create_icon(path, tooltip) {
    const tooltipContainer = tooltipContainerTemplate.cloneNode(true).children[0]
    const image = document.createElement("img")

    image.classList.add("icon")
    image.src = path
    image.loading = "lazy"

    tooltipContainer.appendChild(image)
    tooltipContainer.querySelector(".tooltip").textContent = tooltip

    return tooltipContainer
}