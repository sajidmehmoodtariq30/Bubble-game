let bottomDiv = document.getElementById('bottom');
let hit = document.getElementById('hit');
let clutter = '';

function change() {
    clutter = '';
    for (let i = 0; i < 200; i++) {
        let value = random();
        clutter += `<div class="bubble">${value}</div>`;
    }

    bottomDiv.innerHTML = clutter;

    // After changing the content, re-fetch the bubble elements
    let bubble = document.getElementsByClassName('bubble');

    // Attach event listeners to the new bubble elements
    Array.from(bubble).forEach(element => {
        element.addEventListener('click', () => {
            let hitvalue = random();
            hit.innerHTML = hitvalue;
            bottomDiv.innerHTML = ''; // Clear the bubbles
            change(); // Re-generate bubbles
        });
    });
}

// Initialize the first set of bubbles
change();

function random() {
    let randomNum = Math.floor(Math.random() * 10) + 1;
    return randomNum;
}