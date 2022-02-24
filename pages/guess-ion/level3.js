/* This file contains the specific code for Level 3 to work. It was separated from the
rest due to clarity concerns. */

var selected_ions = undefined;
var currently_chosen_ion_name = undefined;
var names_already_chosen = [];
var symbols_already_chosen = [];

function handleIonNameClick(e) {
    // When an ion name is clicked, we temporarily disable the events of the
    // remaining ion names, and enable the events of the symbols;

    setSquareToSelected(e);
    e.target.removeEventListener('mouseleave', setSquareToUnselected);
    names_already_chosen.push(e.target.innerHTML);
    currently_chosen_ion_name = e.target.innerHTML;
    disableTopRowEvents();
    enableBottomRowEvents();
}

function handleIonSymbolClick(e) {
    // When an ion symbol is clicked, we temporarily disable the events of the
    // remaining ion symbols, and enable the events of the names;

    setSquareToSelected(e);
    e.target.removeEventListener('mouseleave', setSquareToUnselected);
    symbols_already_chosen.push(e.target.innerHTML);
    enableTopRowEvents();
    disableBottomRowEvents();

    // When a symbol is clicked, that means a name was chosen. Check if the symbol
    // corresponds to the name.
    for (ion of selected_ions) {
        if (ion["name"] == currently_chosen_ion_name) {
            if (ion["symbol"] == e.target.innerHTML) {
                // The guess was correct. Set colors to a disabled state.
                disableIonPair(ion);
            }
        }
    }
}

function disableIonPair(ion) {
    // Find both squares and set them to a neutral color
    var symbols = document.getElementsByClassName("ion-bottom-row");
    var names = document.getElementsByClassName("ion-top-row");
    var style = getComputedStyle(document.body);


    for (let symbol of symbols) {
        if (symbol.innerHTML == ion["symbol"])
            symbol.style.background = style.getPropertyValue("--border-color");
    }

    for (let name of names) {
        if (name.innerHTML == ion["name"])
            name.style.background = style.getPropertyValue("--border-color");
    }
}

function enableBottomRowEvents() {
    // Allow clicking/highlight only in elements that were not selected before.
    var ion_symbols = document.getElementsByClassName("ion-bottom-row");
    const available_ion_symbols = Array.from(ion_symbols).filter(
        (el) => {
            return !symbols_already_chosen.includes(el.innerHTML);
    });

    for (var ion_symbol of available_ion_symbols) {
        elClone = ion_symbol.cloneNode(true);
        ion_symbol.parentNode.replaceChild(elClone, ion_symbol);
        elClone.addEventListener('mouseenter', setSquareToSelected)
        elClone.addEventListener('mouseleave', setSquareToUnselected);
        elClone.addEventListener('click', e => handleIonSymbolClick(e));
    }
}

function enableTopRowEvents() {
    var ion_names = document.getElementsByClassName("ion-top-row");
    const available_ion_names = Array.from(ion_names).filter(
        (el) => {
            return !names_already_chosen.includes(el.innerHTML);
    });

    for (var ion_name of available_ion_names) {
        elClone = ion_name.cloneNode(true);
        ion_name.parentNode.replaceChild(elClone, ion_name);
        elClone.addEventListener('mouseenter', setSquareToSelected)
        elClone.addEventListener('mouseleave', setSquareToUnselected);
        elClone.addEventListener('click', e => handleIonNameClick(e));
    }
}

function disableTopRowEvents() {
    var ion_names = document.getElementsByClassName("ion-top-row");
    for (ion_name of ion_names){
        elClone = ion_name.cloneNode(true);
        ion_name.parentNode.replaceChild(elClone, ion_name);
    }
}

function disableBottomRowEvents() {
    var ion_symbols = document.getElementsByClassName("ion-bottom-row");
    for (ion_symbol of ion_symbols){
        elClone = ion_symbol.cloneNode(true);
        ion_symbol.parentNode.replaceChild(elClone, ion_symbol);
    }
}


async function runLevel3() {
    selected_ions = await getRandomIons(3, 3);
    document.getElementById("next-button").style.visibility = "hidden";

    var ion_names = document.getElementsByClassName("ion-top-row");
    for (i in selected_ions) {
        ion_names[i].innerHTML = selected_ions[i]["name"]
    }

    shuffleArray(selected_ions);

    var ion_symbols = document.getElementsByClassName("ion-bottom-row");
    for (i in selected_ions) {
        ion_symbols[i].innerHTML = selected_ions[i]["symbol"]
    }

    // First, we only allow uncolored/not chosen ion names (top-row) to be interactable
    enableTopRowEvents();
}
