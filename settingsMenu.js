import * as data from "./globalData.js"
import { create_icon } from "./main.js"

const settingsMenuShade = document.querySelector("#settings-menu-shade")
const settingsMenu = document.querySelector("#settings-menu")
const settingsClassGrid = document.querySelector("#settings-class-grid")
const settingsFactionGrid = document.querySelector("#settings-faction-grid")

const rarityButtonList = []
const classButtonMap = new Map()
const factionButtonMap = new Map()

const selectAllRarity = document.querySelector("#select-all-rarity")
const selectAllClass = document.querySelector("#select-all-class")
const selectAllFaction = document.querySelector("#select-all-faction")

let tempChanges = data.settings.duplicate()

document.querySelector("#settings-cancel").addEventListener("click", closeMenu)
document.querySelector("#settings-button").addEventListener("click", openMenu)
settingsMenuShade.addEventListener("click", closeMenu)
settingsMenu.addEventListener("click", e => e.stopPropagation())

selectAllRarity.addEventListener("click", () => {
    tempChanges.rarity.fill(!tempChanges.rarity.every(r => r))
    updateRarityButtons()
    selectAllRarity.textContent = tempChanges.rarity.every(r => r)? "Unselect All": "Select All"
})

selectAllClass.addEventListener("click", () => {
    const classes = Object.keys(data.class_map)
    if (tempChanges.class.size < classes.length) tempChanges.class = new Set(classes)
    else tempChanges.class.clear()
    updateClassButtons()
    selectAllClass.textContent = tempChanges.class.size == classes.length? "Unselect All": "Select All"
})

selectAllFaction.addEventListener("click", () => {
    const factions = Object.keys(data.faction_subfaction)
    if (tempChanges.faction.size < factions.length) tempChanges.faction = new Set(factions)
    else tempChanges.faction.clear()
    updateFactionButtons()
    selectAllFaction.textContent = tempChanges.faction.size == factions.length? "Unselect All": "Select All"
})

document.querySelector("#settings-apply").addEventListener("click", () => {
    if (tempChanges.rarity.every(r => !r)) {
        alert("Must select at least 1 rarity")
    } else if (tempChanges.class.size == 0) {
        alert("Must select at least 1 class")
    } else if (tempChanges.faction.size == 0) {
        alert("Must select at least 1 faction")
    } else {
        data.settings.update(tempChanges)
        closeMenu()
    }
})

loadButtons().then(updateAllButtons)


async function loadButtons() {
    document.querySelectorAll(".rarity-button").forEach(b => {
        rarityButtonList.push(b)
        b.addEventListener("click", () => {
            b.classList.toggle("excluded")
            tempChanges.rarity[Number(b.dataset.rarity) - 1] = !tempChanges.rarity[Number(b.dataset.rarity) - 1]
        })
    })
    selectAllRarity.textContent = tempChanges.rarity.every(r => r)? "Unselect All": "Select All"

    for (const id in data.class_map) {
        const obj = data.class_map[id]

        const button = create_button(data.IMAGE_PATH_CLASS + obj.icon, obj.name)
    
        button.addEventListener("click", () => {
            button.classList.toggle("excluded")
            if (tempChanges.class.has(id)) {
                tempChanges.class.delete(id)
            } else tempChanges.class.add(id)
        })
        
        settingsClassGrid.appendChild(button)
        classButtonMap.set(id, button)
    }
    selectAllClass.textContent = tempChanges.class.size == Object.keys(data.class_map).length? "Unselect All": "Select All"
        
        
    for (const id in data.faction_subfaction) {
        const obj = data.faction_map[id]
        
        const button = create_button(data.IMAGE_PATH_FACTION + obj.icon, obj.name)
        
        button.addEventListener("click", () => {
            button.classList.toggle("excluded")
            if (tempChanges.faction.has(id)) {
                tempChanges.faction.delete(id)
            } else tempChanges.faction.add(id)
        })
        
        settingsFactionGrid.appendChild(button)
        factionButtonMap.set(id, button)
    }
    selectAllFaction.textContent = tempChanges.faction.size == Object.keys(data.faction_subfaction).length? "Unselect All": "Select All"
}

function create_button(icon_path, name) {
    const button = document.createElement("button")
    button.classList.add("round-border")
    button.classList.add("icon-button")
    button.classList.add("settings-toggle")

    const icon = create_icon(icon_path)
    icon.classList.add("class-icon")

    const txt = document.createElement("span")
    txt.textContent = name

    button.appendChild(icon)
    button.appendChild(txt)

    return button
}

async function updateAllButtons() {
    updateRarityButtons()
    updateClassButtons()
    updateFactionButtons()
}

function updateRarityButtons() {
    for (let i = 0; i < tempChanges.rarity.length; i++) {
        if (tempChanges.rarity[i]) rarityButtonList[i].classList.remove("excluded")
        else rarityButtonList[i].classList.add("excluded")
    }
}

function updateClassButtons() {
    classButtonMap.forEach((button, id) => {
        if (tempChanges.class.has(id)) button.classList.remove("excluded")
            else button.classList.add("excluded")
    })
}

function updateFactionButtons() {
    factionButtonMap.forEach((button, id) => {
        if (tempChanges.faction.has(id)) button.classList.remove("excluded")
        else button.classList.add("excluded")
    })
}

function openMenu() {
    settingsMenuShade.classList.add("show")
}


function closeMenu() {
    settingsMenuShade.classList.remove("show")
    tempChanges = data.settings.duplicate()
    updateAllButtons()
}

