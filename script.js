
const controlsBtn = document.querySelector('.controls-btn');
const controlsClose = document.querySelector('.controls-close');
const controlsPanel = document.querySelector('.controls-panel');
const simulationContainer = document.querySelector('.simulation-container');
const overlay = document.querySelector('.overlay');

controlsBtn.addEventListener('click', () => {
    controlsPanel.classList.add('active');
    overlay.classList.add('active');
});

controlsClose.addEventListener('click', () => {
    controlsPanel.classList.remove('active');
    overlay.classList.remove('active');
});

let speedFactor = 1;

let redRedForce = 0;
let redGreenForce = 0;
let redYellowForce = 0;
let redWhiteForce = 0;

let greenRedForce = 0;
let greenGreenForce = 0;
let greenYellowForce = 0;
let greenWhiteForce = 0;

let yellowRedForce = 0;
let yellowGreenForce = 0;
let yellowYellowForce = 0;
let yellowWhiteForce = 0;

let whiteRedForce = 0;
let whiteGreenForce = 0;
let whiteYellowForce = 0;
let whiteWhiteForce = 0;

let m = document.getElementById("life").getContext('2d');

function drawPracticle(x, y, c, s) {
    m.fillStyle = c;
    m.beginPath();
    m.arc(x, y, s / 2, 0, Math.PI * 2);
    m.fill();
}

function draw(x, y, c, s = 5) {
    m.fillStyle = c;
    m.fillRect(x, y, s, s);
}

let particles = [];

function particle(x, y, c, s = 5) {
    return { "x": x, "y": y, "vx": 0, "vy": 0, "color": c, "size": s };
}

function random() {
    return Math.random() * 1000;
}

function create(number, color, size) {
    let group = [];
    for (let i = 0; i < number; i++) {
        group.push(particle(random(), random(), color, size));
        particles.push(group[i]);
    }
    return group;
}

function rule(particles1, particles2, force) {
    for (let i = 0; i < particles1.length; i++) {
        let a = particles1[i];
        let fx = 0;
        let fy = 0;

        for (let j = 0; j < particles2.length; j++) {
            let b = particles2[j];
            let dx = a.x - b.x;
            let dy = a.y - b.y;
            let d = Math.sqrt(dx * dx + dy * dy);

            if (d > 0 && d < 120) {
                let F = force * 1 / d;
                fx += (F * dx);
                fy += (F * dy);
            }
        }

        a.vx = (a.vx + fx) * 0.5 * speedFactor;
        a.vy = (a.vy + fy) * 0.5 * speedFactor;
        a.x += a.vx * speedFactor;
        a.y += a.vy * speedFactor;

        if (a.x <= 0 || a.x >= 1000) { a.vx *= -1; }
        if (a.y <= 0 || a.y >= 1000) { a.vy *= -1; }
    }
}

let red = create(1000, "red", 5);
let green = create(1000, "green", 5);
let yellow = create(1000, "yellow", 5);
let white = create(1000, "white", 5);

function update() {
    rule(red, red, redRedForce);
    rule(red, green, redGreenForce);
    rule(red, yellow, redYellowForce);
    rule(red, white, redWhiteForce);

    rule(green, red, greenRedForce);
    rule(green, green, greenGreenForce);
    rule(green, yellow, greenYellowForce);
    rule(green, white, greenWhiteForce);

    rule(yellow, red, yellowRedForce);
    rule(yellow, green, yellowGreenForce);
    rule(yellow, yellow, yellowYellowForce);
    rule(yellow, white, yellowWhiteForce);

    rule(white, red, whiteRedForce);
    rule(white, green, whiteGreenForce);
    rule(white, yellow, whiteYellowForce);
    rule(white, white, whiteWhiteForce);

    m.clearRect(0, 0, 1000, 1000);
    draw(0, 0, "black", 1000);
    for (let i = 0; i < particles.length; i++) {
        drawPracticle(particles[i].x, particles[i].y, particles[i].color, particles[i].size);
    }
    requestAnimationFrame(update);
}

update();

function updateParticleSize(color, newSize) {
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].color === color) {
            particles[i].size = newSize;
        }
    }
}

document.getElementById('force-slider-redRed').addEventListener('input', (event) => {
    redRedForce = parseFloat(event.target.value);
    localStorage.setItem('redRedForce', redRedForce);
});
document.getElementById('force-slider-redGreen').addEventListener('input', (event) => {
    redGreenForce = parseFloat(event.target.value);
    localStorage.setItem('redGreenForce', redGreenForce);
});
document.getElementById('force-slider-redYellow').addEventListener('input', (event) => {
    redYellowForce = parseFloat(event.target.value);
    localStorage.setItem('redYellowForce', redYellowForce);
});
document.getElementById('force-slider-redWhite').addEventListener('input', (event) => {
    redWhiteForce = parseFloat(event.target.value);
    localStorage.setItem('redWhiteForce', redWhiteForce);
});

document.getElementById('force-slider-yellowRed').addEventListener('input', (event) => {
    yellowRedForce = parseFloat(event.target.value);
    localStorage.setItem('yellowRedForce', yellowRedForce);
});
document.getElementById('force-slider-yellowGreen').addEventListener('input', (event) => {
    yellowGreenForce = parseFloat(event.target.value);
    localStorage.setItem('yellowGreenForce', yellowGreenForce);
});

document.getElementById('force-slider-yellowYellow').addEventListener('input', (event) => {
    yellowYellowForce = parseFloat(event.target.value);
    localStorage.setItem('yellowYellowForce', yellowYellowForce);
});

document.getElementById('force-slider-yellowWhite').addEventListener('input', (event) => {
    yellowWhiteForce = parseFloat(event.target.value);
    localStorage.setItem('yellowWhiteForce', yellowWhiteForce);
});

document.getElementById('force-slider-greenRed').addEventListener('input', (event) => {
    greenRedForce = parseFloat(event.target.value);
    localStorage.setItem('greenRedForce', greenRedForce);
});
document.getElementById('force-slider-greenGreen').addEventListener('input', (event) => {
    greenGreenForce = parseFloat(event.target.value);
    localStorage.setItem('greenGreenForce', greenGreenForce);
});
document.getElementById('force-slider-greenYellow').addEventListener('input', (event) => {
    greenYellowForce = parseFloat(event.target.value);
    localStorage.setItem('greenYellowForce', greenYellowForce);
});
document.getElementById('force-slider-greenWhite').addEventListener('input', (event) => {
    greenWhiteForce = parseFloat(event.target.value);
    localStorage.setItem('greenWhiteForce', greenWhiteForce);
});

document.getElementById('force-slider-whiteRed').addEventListener('input', (event) => {
    whiteRedForce = parseFloat(event.target.value);
    localStorage.setItem('whiteRedForce', whiteRedForce);
});
document.getElementById('force-slider-whiteGreen').addEventListener('input', (event) => {
    whiteGreenForce = parseFloat(event.target.value);
    localStorage.setItem('whiteGreenForce', whiteGreenForce);
});
document.getElementById('force-slider-whiteYellow').addEventListener('input', (event) => {
    whiteYellowForce = parseFloat(event.target.value);
    localStorage.setItem('whiteYellowForce', whiteYellowForce);
});
document.getElementById('force-slider-whiteWhite').addEventListener('input', (event) => {
    whiteWhiteForce = parseFloat(event.target.value);
    localStorage.setItem('whiteWhiteForce', whiteWhiteForce);
});

document.addEventListener("DOMContentLoaded", function () {
    ['red', 'green', 'yellow', 'white'].forEach(color => {
        document.getElementById(`size-slider-${color}`).addEventListener('input', (event) => {
            let value = parseInt(event.target.value);
            updateParticleSize(color, value);
            localStorage.setItem(`size-${color}`, value);
        });
    });

    loadSliderValues();
});

document.getElementById('speedFactor-slider').addEventListener('input', (event) => {
    speedFactor = parseFloat(event.target.value);
    localStorage.setItem('speedFactor', speedFactor);
});

if (localStorage.getItem('speedFactor')) {
    speedFactor = parseFloat(localStorage.getItem('speedFactor'));
    document.getElementById('speedFactor-slider').value = speedFactor;
}

document.addEventListener("DOMContentLoaded", function () {
    function updateSliderValue(sliderId) {
        const slider = document.getElementById(sliderId);
        const sliderThumb = slider.querySelector('::-webkit-slider-thumb');

        sliderThumb.setAttribute('data-value', slider.value);

        slider.oninput = function () {
            sliderThumb.setAttribute('data-value', this.value);
        };
    }

    updateSliderValue('speedFactor-slider');
    updateSliderValue('size-slider-red');
    updateSliderValue('force-slider-redRed');
    updateSliderValue('force-slider-redYellow');
    updateSliderValue('force-slider-redGreen');
    updateSliderValue('force-slider-redWhite');

    updateSliderValue('size-slider-yellow');
    updateSliderValue('force-slider-yellowYellow');
    updateSliderValue('force-slider-yellowRed');
    updateSliderValue('force-slider-yellowGreen');
    updateSliderValue('force-slider-yellowWhite');

    updateSliderValue('size-slider-green');
    updateSliderValue('force-slider-greenGreen');
    updateSliderValue('force-slider-greenRed');
    updateSliderValue('force-slider-greenYellow');
    updateSliderValue('force-slider-greenWhite');

    updateSliderValue('size-slider-white');
    updateSliderValue('force-slider-whiteWhite');
    updateSliderValue('force-slider-whiteRed');
    updateSliderValue('force-slider-whiteYellow');
    updateSliderValue('force-slider-whiteGreen');
});

document.getElementById('ChromaticDynamics').addEventListener('click', () => {
    speedFactor = 1;

    redRedForce = -0.5;
    redGreenForce = 1;
    redYellowForce = 0.5;
    redWhiteForce = -1;

    greenRedForce = 1;
    greenGreenForce = -0.5;
    greenYellowForce = -1;
    greenWhiteForce = 0.5;

    yellowRedForce = 0.5;
    yellowGreenForce = -1;
    yellowYellowForce = -0.5;
    yellowWhiteForce = 1;

    whiteRedForce = -1;
    whiteGreenForce = 0.5;
    whiteYellowForce = 1;
    whiteWhiteForce = -0.5;
});
document.getElementById('HarmonicFlux').addEventListener('click', () => {
    speedFactor = 1;

    redRedForce = 0.5;    // Mild attraction between red particles
    redGreenForce = -0.5; // Mild repulsion between red and green particles
    redYellowForce = 1;   // Strong attraction between red and yellow particles
    redWhiteForce = 0;    // Neutral interaction between red and white particles

    greenRedForce = -0.5; // Mild repulsion between green and red particles
    greenGreenForce = 0.5; // Mild attraction between green particles
    greenYellowForce = 0;  // Neutral interaction between green and yellow particles
    greenWhiteForce = 1;   // Strong attraction between green and white particles

    yellowRedForce = 1;   // Strong attraction between yellow and red particles
    yellowGreenForce = 0; // Neutral interaction between yellow and green particles
    yellowYellowForce = -0.5; // Mild repulsion between yellow particles
    yellowWhiteForce = -0.5;  // Mild repulsion between yellow and white particles

    whiteRedForce = 0;    // Neutral interaction between white and red particles
    whiteGreenForce = 1;  // Strong attraction between white and green particles
    whiteYellowForce = -0.5; // Mild repulsion between white and yellow particles
    whiteWhiteForce = 0.5;   // Mild attraction between white particles
});

document.getElementById('VibrantMosaic').addEventListener('click', () => {
    speedFactor = 1;

    // Red Particles
    redRedForce = 1;        // Strong attraction to each other
    redGreenForce = -1;     // Strong repulsion from green particles
    redYellowForce = 0.5;   // Mild attraction to yellow particles
    redWhiteForce = -0.5;   // Mild repulsion from white particles

    // Green Particles
    greenRedForce = -1;     // Strong repulsion from red particles
    greenGreenForce = 0;    // Neutral interaction with other green particles
    greenYellowForce = 1;   // Strong attraction to yellow particles
    greenWhiteForce = 0.5;  // Mild attraction to white particles

    // Yellow Particles
    yellowRedForce = 0.5;   // Mild attraction to red particles
    yellowGreenForce = 1;   // Strong attraction to green particles
    yellowYellowForce = -1; // Strong repulsion from other yellow particles
    yellowWhiteForce = -1;  // Strong repulsion from white particles

    // White Particles
    whiteRedForce = -0.5;   // Mild repulsion from red particles
    whiteGreenForce = 0.5;  // Mild attraction to green particles
    whiteYellowForce = -1;  // Strong repulsion from yellow particles
    whiteWhiteForce = 1;    // Strong attraction to each other
});

document.getElementById('CosmicKaleidoscope').addEventListener('click', () => {
    speedFactor = 1;

    // Red Particles
    redRedForce = -1;      // Strong repulsion from other red particles
    redGreenForce = 0.5;   // Mild attraction to green particles
    redYellowForce = -0.5; // Mild repulsion from yellow particles
    redWhiteForce = 1;     // Strong attraction to white particles

    // Green Particles
    greenRedForce = 0.5;   // Mild attraction to red particles
    greenGreenForce = -1;  // Strong repulsion from other green particles
    greenYellowForce = 1;  // Strong attraction to yellow particles
    greenWhiteForce = -0.5;// Mild repulsion from white particles

    // Yellow Particles
    yellowRedForce = -0.5; // Mild repulsion from red particles
    yellowGreenForce = 1;  // Strong attraction to green particles
    yellowYellowForce = -1;// Strong repulsion from other yellow particles
    yellowWhiteForce = 0.5;// Mild attraction to white particles

    // White Particles
    whiteRedForce = 1;     // Strong attraction to red particles
    whiteGreenForce = -0.5;// Mild repulsion from green particles
    whiteYellowForce = 0.5;// Mild attraction to yellow particles
    whiteWhiteForce = -1;  // Strong repulsion from other white particles
});

document.getElementById('EtherealWeave').addEventListener('click', () => {
    speedFactor = 1;

    // Red Particles
    redRedForce = 0.01;    // Very slight attraction among red particles
    redGreenForce = -0.02; // Slight repulsion from green particles
    redYellowForce = 0.03; // Mild attraction to yellow particles
    redWhiteForce = -0.01; // Very slight repulsion from white particles

    // Green Particles
    greenRedForce = -0.02; // Slight repulsion from red particles
    greenGreenForce = 0.01; // Very slight attraction among green particles
    greenYellowForce = -0.01;// Very slight repulsion from yellow particles
    greenWhiteForce = 0.03; // Mild attraction to white particles

    // Yellow Particles
    yellowRedForce = 0.03; // Mild attraction to red particles
    yellowGreenForce = -0.01;// Very slight repulsion from green particles
    yellowYellowForce = 0.01;// Very slight attraction among yellow particles
    yellowWhiteForce = -0.02;// Slight repulsion from white particles

    // White Particles
    whiteRedForce = -0.01; // Very slight repulsion from red particles
    whiteGreenForce = 0.03; // Mild attraction to green particles
    whiteYellowForce = -0.02;// Slight repulsion from yellow particles
    whiteWhiteForce = 0.01;  // Very slight attraction among white particles
});
document.getElementById('CellularHarmony').addEventListener('click', () => {
    speedFactor = 1;

    // Red Particles - Representing the Cytoplasm
    redRedForce = 0.05;    // Very mild attraction among cytoplasm particles
    redGreenForce = 0.1;   // Mild attraction to organelle particles
    redYellowForce = -0.3; // Moderate repulsion from membrane particles
    redWhiteForce = -0.05; // Very mild repulsion from nucleus particles

    // Green Particles - Representing Organelles
    greenRedForce = 0.1;   // Mild attraction to cytoplasm particles
    greenGreenForce = -0.2;// Mild repulsion from other organelles
    greenYellowForce = -0.2;// Mild repulsion from membrane particles
    greenWhiteForce = 0.4; // Strong attraction to nucleus particles

    // Yellow Particles - Representing the Cell Membrane
    yellowRedForce = -0.3; // Moderate repulsion from cytoplasm particles
    yellowGreenForce = -0.2;// Mild repulsion from organelle particles
    yellowYellowForce = 0.2;// Mild attraction among membrane particles
    yellowWhiteForce = -0.1;// Mild repulsion from nucleus particles

    // White Particles - Representing the Nucleus
    whiteRedForce = -0.05; // Very mild repulsion from cytoplasm particles
    whiteGreenForce = 0.4; // Strong attraction to organelle particles
    whiteYellowForce = -0.1;// Mild repulsion from membrane particles
    whiteWhiteForce = 0.1;  // Mild attraction among nucleus particles
});

document.getElementById('Automata').addEventListener('click', () => {
    speedFactor = 1;

    // Red Particles
    redRedForce = 0.2;    // Mild attraction among red particles
    redGreenForce = -0.5; // Repulsion from green particles
    redYellowForce = 0.1; // Slight attraction to yellow particles
    redWhiteForce = -0.3; // Mild repulsion from white particles

    // Green Particles
    greenRedForce = -0.5; // Repulsion from red particles
    greenGreenForce = 0.2; // Mild attraction among green particles
    greenYellowForce = -0.3;// Mild repulsion from yellow particles
    greenWhiteForce = 0.1; // Slight attraction to white particles

    // Yellow Particles
    yellowRedForce = 0.1;  // Slight attraction to red particles
    yellowGreenForce = -0.3;// Mild repulsion from green particles
    yellowYellowForce = 0.2;// Mild attraction among yellow particles
    yellowWhiteForce = -0.5;// Strong repulsion from white particles

    // White Particles
    whiteRedForce = -0.3;  // Mild repulsion from red particles
    whiteGreenForce = 0.1; // Slight attraction to green particles
    whiteYellowForce = -0.5;// Strong repulsion from yellow particles
    whiteWhiteForce = 0.2;  // Mild attraction among white particles
});

document.getElementById('EvolvingEntity').addEventListener('click', () => {
    speedFactor = 1;

    // Red Particles - Representing one aspect of the entity
    redRedForce = -0.3;    // Repulsion among red particles to increase movement
    redGreenForce = 0.5;   // Strong attraction to green particles
    redYellowForce = -0.5; // Strong repulsion from yellow particles
    redWhiteForce = 0.2;   // Mild attraction to white particles

    // Green Particles - Representing another aspect of the entity
    greenRedForce = 0.5;   // Strong attraction to red particles
    greenGreenForce = -0.3; // Repulsion among green particles to increase movement
    greenYellowForce = 0.2; // Mild attraction to yellow particles
    greenWhiteForce = -0.5; // Strong repulsion from white particles

    // Yellow Particles - Representing environmental interaction
    yellowRedForce = -0.5; // Strong repulsion from red particles
    yellowGreenForce = 0.2; // Mild attraction to green particles
    yellowYellowForce = -0.3; // Repulsion among yellow particles to increase movement
    yellowWhiteForce = 0.5;  // Strong attraction to white particles

    // White Particles - Representing another aspect of environmental interaction
    whiteRedForce = 0.2;    // Mild attraction to red particles
    whiteGreenForce = -0.5; // Strong repulsion from green particles
    whiteYellowForce = 0.5; // Strong attraction to yellow particles
    whiteWhiteForce = -0.3; // Repulsion among white particles to increase movement
});

document.getElementById('HarmoniousEntity').addEventListener('click', () => {
    speedFactor = 1;

    // Red Particles - Representing one aspect of the entity
    redRedForce = -0.2;    // Moderate repulsion among red particles
    redGreenForce = 0.3;   // Moderate attraction to green particles
    redYellowForce = -0.3; // Moderate repulsion from yellow particles
    redWhiteForce = 0.1;   // Mild attraction to white particles

    // Green Particles - Representing another aspect of the entity
    greenRedForce = 0.3;   // Moderate attraction to red particles
    greenGreenForce = -0.2; // Moderate repulsion among green particles
    greenYellowForce = 0.1; // Mild attraction to yellow particles
    greenWhiteForce = -0.3; // Moderate repulsion from white particles

    // Yellow Particles - Representing environmental interaction
    yellowRedForce = -0.3; // Moderate repulsion from red particles
    yellowGreenForce = 0.1; // Mild attraction to green particles
    yellowYellowForce = -0.2; // Moderate repulsion among yellow particles
    yellowWhiteForce = 0.3;  // Moderate attraction to white particles

    // White Particles - Representing another aspect of environmental interaction
    whiteRedForce = 0.1;    // Mild attraction to red particles
    whiteGreenForce = -0.3; // Moderate repulsion from green particles
    whiteYellowForce = 0.3; // Moderate attraction to yellow particles
    whiteWhiteForce = -0.2; // Moderate repulsion among white particles
});

