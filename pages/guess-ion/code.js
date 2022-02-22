function loadGame() {
    const ion = 2;
}

function closeInstructions() {
    var instructions = document.getElementById("start");
    instructions.classList.add("close-rule-card");
    setTimeout(() => {
        instructions.style.display = "none";
        instructions.classList.remove("close-rule-card");
        var game = document.getElementById("game-container");
        game.style.display = "block";

    }, 205)
    
}

function openInstructions() {
    var instructions = document.getElementById("start");
    instructions.style.display = "block";
    var game = document.getElementById("game-container");
    game.style.display = "none";
}