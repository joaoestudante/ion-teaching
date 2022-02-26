/* This file contains the specific code for Level 3 to work. It was separated from the
rest due to clarity concerns. */

var selected_ions = undefined;
var currently_chosen_ion_name = undefined;
var current_selection_n = 1;
var names_already_chosen = [];
var symbols_already_chosen = [];
var progress = 0;
var max_guess = 5;

function setSquareToSelected(e) {
    // This overrides the function defined previously in the other file
    switch(current_selection_n) {
        case 1:
            e.target.classList.add("firstIonSelected");
            break;
        case 2:
            e.target.classList.add("secondIonSelected");
            break;
        case 3:
            e.target.classList.add("thirdIonSelected");
            break;
        default:
            break;
    }
}

function setSquareToUnselected(e) {
    // This overrides the function defined previously in the other file
    switch(current_selection_n) {
        case 1:
            e.target.classList.remove("firstIonSelected");
            break;
        case 2:
            e.target.classList.remove("secondIonSelected");
            break;
        case 3:
            e.target.classList.remove("thirdIonSelected");
            break;
        default:
            break;
    }
}

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

    //setSquareToSelected(e);
    e.target.removeEventListener('mouseleave', setSquareToUnselected);
    symbols_already_chosen.push(e.target.innerHTML);
    enableTopRowEvents();
    disableBottomRowEvents();

    // When a symbol is clicked, that means a name was chosen before. Check if the symbol
    // corresponds to the name.
    for (ion of selected_ions) {
        if (ion["name"] == currently_chosen_ion_name) {
            if (ion["symbol"] != e.target.innerHTML) {
                // Guess was wrong - handle it
                handleWrongGuess(ion, e.target.innerHTML);
            } else {
                e.target.classList.add("correct-guess");
                if (current_selection_n == 3)
                    document.getElementById("next-button").style.visibility = "visible";
            }
        }
    }
    current_selection_n += 1;
    if (current_selection_n == 4) {
        document.getElementsByClassName("fa-solid fa-star")[progress].classList.add("star-correct");
        progress += 1;
    }
    if (progress == max_guess) {
        // Game should finish
        let button = document.getElementById("next-button");
        button.innerHTML = "Terminar!";
        button.removeEventListener("click", runLevel3);
        button.addEventListener("click", finishLevel.bind(null, e, 3));
    }
}

function handleWrongGuess(ion, e) {
    var symbols = document.getElementsByClassName("ion-bottom-row");
    var names = document.getElementsByClassName("ion-top-row");
    document.getElementsByClassName("fa-solid fa-star")[progress].classList.add("star-wrong");
    progress += 1;
    for (let ion_name of names) {
        if (ion_name.innerHTML == ion["name"])  {
            ion_name.classList.add("wrong-guess");
        }
    }
    for (let ion_symbol of symbols) {
        if (ion_symbol.innerHTML == e) {
            ion_symbol.classList.add("wrong-guess");
        }
    }

    // If a guess is incorrect, then no more guesses can be made.
    disableTopRowEvents();
    document.getElementById("next-button").style.visibility = "visible";
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
        elClone.classList.remove("disabled-square");
    }
}

function enableTopRowEvents() {
    var ion_names = document.getElementsByClassName("ion-top-row");
    const available_ion_names = Array.from(ion_names).filter(
        (el) => {
            return !names_already_chosen.includes(el.innerHTML);
    });
    for (var ion_name of ion_names) {
        if (names_already_chosen.includes(ion_name.innerHTML)) {
            ion_name.classList.add("disabled-square");
        }
    }
    for (var ion_name of available_ion_names) {
        elClone = ion_name.cloneNode(true);
        ion_name.parentNode.replaceChild(elClone, ion_name);
        elClone.addEventListener('mouseenter', setSquareToSelected)
        elClone.addEventListener('mouseleave', setSquareToUnselected);
        elClone.addEventListener('click', e => handleIonNameClick(e));
        elClone.classList.remove("disabled-square");
    }
}

function disableTopRowEvents() {
    var ion_names = document.getElementsByClassName("ion-top-row");
    for (ion_name of ion_names){
        elClone = ion_name.cloneNode(true);
        ion_name.parentNode.replaceChild(elClone, ion_name);
        if (ion_name.innerHTML != currently_chosen_ion_name)
            elClone.classList.add("disabled-square");
    }
}

function disableBottomRowEvents() {
    var ion_symbols = document.getElementsByClassName("ion-bottom-row");
    for (ion_symbol of ion_symbols){
        elClone = ion_symbol.cloneNode(true);
        ion_symbol.parentNode.replaceChild(elClone, ion_symbol);
        elClone.classList.add("disabled-square");
    }
}

function cleanUpSquares() {
    for (let order of ["first", "second", "third"]) {
        let el_list = Array.from(document.getElementsByClassName(order+"IonSelected"));
        el_list.forEach((el) => {
            el.classList.remove(order+"IonSelected");
            el.classList.remove("disabled-square");
            el.classList.remove("wrong-guess");
            el.classList.remove("correct-guess");
        })
    }
}

function cleanUpVariables() {
    selected_ions = undefined;
    currently_chosen_ion_name = undefined;
    current_selection_n = 1;
    names_already_chosen = [];
    symbols_already_chosen = [];
}

async function runLevel3() {
    cleanUpVariables();
    cleanUpSquares();
    selected_ions = await getRandomIons(3, 1);
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
    disableBottomRowEvents();
}
