import * as data from "./globalData.js"
import class_subclass from "./data/map/class_subclass.json" with { type: "json" };
import { excludeOperator, create_icon, autoExcludeOperators } from "./main.js";
import { openDetails } from "./operatorDetails.js";

//sort ops, batch exclude, guess or exclude

const frame = document.querySelector(".frame")
const operatorMenu = document.querySelector(".operator-menu")
const operatorContainer = document.querySelector(".operator-container")
const sortInput = document.querySelector("#operator-sort")
const sectionTemplate = document.querySelector("#section-template")
const menuElements = new Map()
const elementGrid = new Map()

let showExcluded = false
export let autoExclude = false

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

export async function loadOperators() {
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
            } else openDetails(id)
        })
        menuElements.set(id, icon)
    }
    displayOperators()
}

function displayOperators(type = "name") {
    const frag = document.createDocumentFragment()

    switch (type) {
        case "name":
            const nameGroups = Map.groupBy(data.operatorList, id => data.operators[id].name[0])
            for (const [k, v] of nameGroups.entries()) {
                frag.appendChild(displaySection(k, v))
            }
            break;
        case "class":
            const classGroups = Map.groupBy(data.operatorList, id => data.operators[id].subclass)

            for (const [class_id, subclasses] of Object.entries(class_subclass)) {
                const class_icon = create_icon(data.IMAGE_PATH_CLASS + data.class_map[class_id].icon, data.class_map[class_id].name)
                class_icon.classList.add("class-icon")
                
                for (const subclass of subclasses) {
                    if (!classGroups.has(subclass)) continue
                    const subclass_icon = create_icon(data.IMAGE_PATH_SUBCLASS + data.subclass_map[subclass].icon, data.subclass_map[subclass].name)
                    subclass_icon.classList.add("class-icon")
                    const titleFrag = document.createDocumentFragment()
                    titleFrag.appendChild(class_icon.cloneNode(true))
                    titleFrag.appendChild(subclass_icon)
                    titleFrag.append(data.subclass_map[subclass].name)
                    
                    frag.appendChild(displaySection(titleFrag, classGroups.get(subclass)))
                }
            }
            break;
        case "rarity":
            const rarityGroups = Map.groupBy(data.operatorList, id => data.operators[id].rarity)
            for (let rarity = 6; rarity >= 1; --rarity) {
                frag.appendChild(displaySection(rarity, rarityGroups.get(rarity)))
            }
            break;
        case "faction":
            const factionGroups = Map.groupBy(data.operatorList, id => data.operators[id].faction)
            
            for (const [faction_id, subfactions] of Object.entries(data.faction_subfaction)) {
                const faction_icon = create_icon(data.IMAGE_PATH_FACTION + data.faction_map[faction_id].icon, data.faction_map[faction_id].name)
                const subfactionGroups = Map.groupBy(factionGroups.get(faction_id), id => data.operators[id].subfaction)
                faction_icon.classList.add("class-icon")
                
                for (const subfaction of subfactions) {
                    if (!subfactionGroups.has(subfaction)) continue
                    const titleFrag = document.createDocumentFragment()
                    titleFrag.appendChild(faction_icon.cloneNode(true))

                    if (subfaction != "") {
                        const subfaction_icon = create_icon(data.IMAGE_PATH_FACTION + data.faction_map[subfaction].icon, data.faction_map[subfaction].name)
                        subfaction_icon.classList.add("class-icon")
                        titleFrag.appendChild(subfaction_icon)
                        titleFrag.append(data.faction_map[subfaction].name)
                    } else titleFrag.append(data.faction_map[faction_id].name)
                    
                    frag.appendChild(displaySection(titleFrag, subfactionGroups.get(subfaction)))
                }
            }
            break
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
