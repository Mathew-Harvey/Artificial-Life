const collapsibleHeader = document.querySelector('.collapsible-header');
const collapsibleContent = document.querySelector('.collapsible-content');

collapsibleHeader.addEventListener('click', function() {
    this.classList.toggle('active');
    if (collapsibleContent.style.maxHeight) {
        collapsibleContent.style.maxHeight = null;
    } else {
        collapsibleContent.style.maxHeight = collapsibleContent.scrollHeight + 'px';
    }
});

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
let trailAmount = 0;
let interactionRange = 120;
let vortexStrength = 0;

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
let activeDynamicPreset = null;
let presetPhase = 0;

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

            if (d > 0 && d < interactionRange) {
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
    applyDynamicPresetForces();

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
    applyVortexField();

    if (trailAmount > 0) {
        m.fillStyle = `rgba(0, 0, 0, ${1.0 - trailAmount * 0.95})`;
        m.fillRect(0, 0, 1000, 1000);
    } else {
        m.clearRect(0, 0, 1000, 1000);
        draw(0, 0, "black", 1000);
    }
    for (let i = 0; i < particles.length; i++) {
        drawPracticle(particles[i].x, particles[i].y, particles[i].color, particles[i].size);
    }
    presetPhase += 0.01;
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

function loadSliderValues() {
    const forceConfig = [
        ['redRedForce', 'force-slider-redRed', (value) => { redRedForce = value; }],
        ['redGreenForce', 'force-slider-redGreen', (value) => { redGreenForce = value; }],
        ['redYellowForce', 'force-slider-redYellow', (value) => { redYellowForce = value; }],
        ['redWhiteForce', 'force-slider-redWhite', (value) => { redWhiteForce = value; }],
        ['greenRedForce', 'force-slider-greenRed', (value) => { greenRedForce = value; }],
        ['greenGreenForce', 'force-slider-greenGreen', (value) => { greenGreenForce = value; }],
        ['greenYellowForce', 'force-slider-greenYellow', (value) => { greenYellowForce = value; }],
        ['greenWhiteForce', 'force-slider-greenWhite', (value) => { greenWhiteForce = value; }],
        ['yellowRedForce', 'force-slider-yellowRed', (value) => { yellowRedForce = value; }],
        ['yellowGreenForce', 'force-slider-yellowGreen', (value) => { yellowGreenForce = value; }],
        ['yellowYellowForce', 'force-slider-yellowYellow', (value) => { yellowYellowForce = value; }],
        ['yellowWhiteForce', 'force-slider-yellowWhite', (value) => { yellowWhiteForce = value; }],
        ['whiteRedForce', 'force-slider-whiteRed', (value) => { whiteRedForce = value; }],
        ['whiteGreenForce', 'force-slider-whiteGreen', (value) => { whiteGreenForce = value; }],
        ['whiteYellowForce', 'force-slider-whiteYellow', (value) => { whiteYellowForce = value; }],
        ['whiteWhiteForce', 'force-slider-whiteWhite', (value) => { whiteWhiteForce = value; }]
    ];

    forceConfig.forEach(([storageKey, sliderId, setter]) => {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) {
            const value = parseFloat(stored);
            setter(value);
            const slider = document.getElementById(sliderId);
            const valueLabel = document.getElementById(sliderId.replace('force-slider', 'force-value'));
            if (slider) slider.value = value;
            if (valueLabel) valueLabel.textContent = value.toFixed(2);
        }
    });

    ['red', 'green', 'yellow', 'white'].forEach((color) => {
        const stored = localStorage.getItem(`size-${color}`);
        if (stored !== null) {
            const value = parseInt(stored, 10);
            updateParticleSize(color, value);
            const slider = document.getElementById(`size-slider-${color}`);
            const valueLabel = document.getElementById(`size-value-${color}`);
            if (slider) slider.value = value;
            if (valueLabel) valueLabel.textContent = value;
        }
    });
}

function setTrailsAndRange(trail, range) {
    trailAmount = trail;
    interactionRange = range;
    document.getElementById('trails-slider').value = trail;
    document.getElementById('trails-value').textContent = trail.toFixed(2);
    document.getElementById('range-slider').value = range;
    document.getElementById('range-value').textContent = range;
}

function setVortex(strength) {
    vortexStrength = strength;
    document.getElementById('vortex-slider').value = strength;
    document.getElementById('vortex-value').textContent = strength.toFixed(2);
}

function applyVortexField() {
    if (vortexStrength <= 0) return;

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - 500;
        const dy = p.y - 500;
        const distance = Math.sqrt(dx * dx + dy * dy) + 0.0001;
        const radialFalloff = Math.min(distance / 500, 1);
        const swirl = vortexStrength * 0.06 * radialFalloff;

        // Tangential push around center to create large-scale rotating flow.
        p.vx += (-dy / distance) * swirl;
        p.vy += (dx / distance) * swirl;
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

document.getElementById('trails-slider').addEventListener('input', (event) => {
    trailAmount = parseFloat(event.target.value);
    document.getElementById('trails-value').textContent = trailAmount.toFixed(2);
    localStorage.setItem('trailAmount', trailAmount);
});

document.getElementById('range-slider').addEventListener('input', (event) => {
    interactionRange = parseInt(event.target.value);
    document.getElementById('range-value').textContent = interactionRange;
    localStorage.setItem('interactionRange', interactionRange);
});

document.getElementById('vortex-slider').addEventListener('input', (event) => {
    vortexStrength = parseFloat(event.target.value);
    document.getElementById('vortex-value').textContent = vortexStrength.toFixed(2);
    localStorage.setItem('vortexStrength', vortexStrength);
});

if (localStorage.getItem('trailAmount')) {
    trailAmount = parseFloat(localStorage.getItem('trailAmount'));
    document.getElementById('trails-slider').value = trailAmount;
    document.getElementById('trails-value').textContent = trailAmount.toFixed(2);
}
if (localStorage.getItem('interactionRange')) {
    interactionRange = parseInt(localStorage.getItem('interactionRange'));
    document.getElementById('range-slider').value = interactionRange;
    document.getElementById('range-value').textContent = interactionRange;
}
if (localStorage.getItem('vortexStrength')) {
    vortexStrength = parseFloat(localStorage.getItem('vortexStrength'));
    document.getElementById('vortex-slider').value = vortexStrength;
    document.getElementById('vortex-value').textContent = vortexStrength.toFixed(2);
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

    updateSliderValue('trails-slider');
    updateSliderValue('range-slider');
    updateSliderValue('vortex-slider');
});

// Any preset click disables dynamic modulation by default.
// Dynamic presets explicitly re-enable their own behavior.
document.querySelectorAll('.preset-btn').forEach((button) => {
    button.addEventListener('click', () => {
        activeDynamicPreset = null;
    });
});

function applyDynamicPresetForces() {
    if (activeDynamicPreset === 'PrismaticTide') {
        const waveA = Math.sin(presetPhase * 0.7);
        const waveB = Math.sin(presetPhase * 1.1 + 1.3);

        redRedForce = -0.05 + waveA * 0.08;
        redGreenForce = 0.35 + waveB * 0.22;
        redYellowForce = -0.22 + waveA * 0.18;
        redWhiteForce = 0.12 + waveB * 0.2;

        greenRedForce = 0.34 - waveB * 0.2;
        greenGreenForce = -0.05 + waveA * 0.08;
        greenYellowForce = 0.14 + waveA * 0.2;
        greenWhiteForce = -0.24 + waveB * 0.2;

        yellowRedForce = -0.2 + waveA * 0.18;
        yellowGreenForce = 0.12 + waveB * 0.2;
        yellowYellowForce = -0.05 + waveA * 0.08;
        yellowWhiteForce = 0.33 - waveB * 0.2;

        whiteRedForce = 0.14 + waveB * 0.2;
        whiteGreenForce = -0.26 + waveA * 0.18;
        whiteYellowForce = 0.34 + waveB * 0.22;
        whiteWhiteForce = -0.05 + waveA * 0.08;

        speedFactor = 0.85 + Math.sin(presetPhase * 0.45) * 0.08;
    } else if (activeDynamicPreset === 'CathedralBloom') {
        const pulse = Math.sin(presetPhase * 0.35);
        const choir = Math.sin(presetPhase * 0.95 + 0.5);
        const shimmer = Math.sin(presetPhase * 1.6 + 2.1);

        // White builds and relaxes central architecture over long cycles.
        whiteWhiteForce = -0.34 - pulse * 0.22;
        whiteRedForce = 0.24 + choir * 0.16;
        whiteGreenForce = -0.08 + shimmer * 0.14;
        whiteYellowForce = 0.26 + choir * 0.18;

        // Red and yellow alternately orbit and peel away from white cores.
        redWhiteForce = -0.28 - choir * 0.2;
        yellowWhiteForce = -0.3 + choir * 0.2;
        redYellowForce = -0.14 + shimmer * 0.2;
        yellowRedForce = -0.14 - shimmer * 0.2;

        // Green behaves like connective tissue, switching between braid and dispersion.
        greenWhiteForce = -0.22 + pulse * 0.18;
        greenRedForce = -0.16 + shimmer * 0.2;
        greenYellowForce = -0.16 - shimmer * 0.2;
        greenGreenForce = 0.08 + pulse * 0.18;

        redRedForce = 0.1 + pulse * 0.16;
        redGreenForce = -0.12 + choir * 0.16;
        yellowYellowForce = 0.1 - pulse * 0.16;
        yellowGreenForce = -0.12 - choir * 0.16;

        speedFactor = 0.62 + Math.sin(presetPhase * 0.3) * 0.07;
    }
}

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

// ── Claude Opus 4 — 2026 ──────────────────────────────────────────────

document.getElementById('Symbiogenesis').addEventListener('click', () => {
    // Two organisms, each with a dense core and dispersive shell:
    //   Organism 1: Red core + Green shell
    //   Organism 2: Yellow core + White shell
    // Core strongly attracts shell, but shell only weakly reciprocates (asymmetric chase)
    // Shells self-repel to stay fluid — creates permanent breathing/pulsing
    // Inter-organism forces create slow mutual drift without merger
    speedFactor = 0.9;

    // Red — dense core of Organism 1
    redRedForce = -0.2;       // cores cluster together
    redGreenForce = -0.35;    // strongly attract own shell
    redYellowForce = -0.08;   // faint attraction to other core
    redWhiteForce = 0.15;     // repel other organism's shell

    // Green — dispersive shell of Organism 1
    greenRedForce = -0.12;    // only mildly attracted to own core (asymmetric!)
    greenGreenForce = 0.2;    // shell particles disperse from each other
    greenYellowForce = 0.15;  // repel other organism's core
    greenWhiteForce = -0.05;  // faint bridge to other shell

    // Yellow — dense core of Organism 2
    yellowRedForce = -0.08;   // faint attraction to other core
    yellowGreenForce = 0.15;  // repel other organism's shell
    yellowYellowForce = -0.2; // cores cluster together
    yellowWhiteForce = -0.35; // strongly attract own shell

    // White — dispersive shell of Organism 2
    whiteRedForce = 0.15;     // repel other organism's core
    whiteGreenForce = -0.05;  // faint bridge to other shell
    whiteYellowForce = -0.12; // only mildly attracted to own core (asymmetric!)
    whiteWhiteForce = 0.2;    // shell particles disperse from each other

    updateParticleSize('red', 5);
    updateParticleSize('green', 3);
    updateParticleSize('yellow', 5);
    updateParticleSize('white', 3);
    setTrailsAndRange(0.3, 150);
    setVortex(0.12);
});

document.getElementById('Ouroboros').addEventListener('click', () => {
    // Circular predator-prey chain: Red→Green→Yellow→White→Red
    // Each color hunts the next and flees the previous
    // Moderate forces prevent instant collapse (damping is aggressive)
    // Herding keeps groups visible; bystander attraction keeps the system coupled
    speedFactor = 1;

    // Red — hunts Green, flees from White
    redRedForce = -0.15;      // herding (form visible packs)
    redGreenForce = -0.38;    // chase green (prey) — moderate, not overwhelming
    redYellowForce = -0.05;   // faint bystander attraction (keeps system coupled)
    redWhiteForce = 0.32;     // flee white (predator)

    // Green — hunts Yellow, flees from Red
    greenRedForce = 0.32;     // flee red (predator)
    greenGreenForce = -0.15;  // herding
    greenYellowForce = -0.38; // chase yellow (prey)
    greenWhiteForce = -0.05;  // faint bystander attraction

    // Yellow — hunts White, flees from Green
    yellowRedForce = -0.05;   // faint bystander attraction
    yellowGreenForce = 0.32;  // flee green (predator)
    yellowYellowForce = -0.15;// herding
    yellowWhiteForce = -0.38; // chase white (prey)

    // White — hunts Red, flees from Yellow
    whiteRedForce = -0.38;    // chase red (prey)
    whiteGreenForce = -0.05;  // faint bystander attraction
    whiteYellowForce = 0.32;  // flee yellow (predator)
    whiteWhiteForce = -0.15;  // herding

    updateParticleSize('red', 4);
    updateParticleSize('green', 4);
    updateParticleSize('yellow', 4);
    updateParticleSize('white', 4);
    setTrailsAndRange(0.5, 100);
    setVortex(0.28);
});

document.getElementById('NeuralAwakening').addEventListener('click', () => {
    // A simulation of neural activity:
    //   White = neuron bodies (large, cluster into brain regions)
    //   Red   = excitatory signals (small, orbit neurons in firing patterns)
    //   Green = inhibitory signals (chase red signals around the landscape)
    //   Yellow = ambient neural field (tiny, diffuse background hum)
    // KEY: Red is drawn TO white, but white PUSHES red away — creating
    //   permanent oscillating orbits (like neurons firing and resetting)
    speedFactor = 0.8;

    // Red — excitatory signals: drawn to neurons but ejected on arrival (firing!)
    redRedForce = 0.15;       // signals scatter apart
    redGreenForce = 0.2;      // signals flee from inhibitors
    redYellowForce = -0.06;   // faint pull from background field
    redWhiteForce = -0.42;    // strongly drawn to neuron clusters

    // Green — inhibitory signals: chase red signals around the landscape
    greenRedForce = -0.38;    // chase red signals to suppress them
    greenGreenForce = 0.08;   // slight self-dispersal (patrol widely)
    greenYellowForce = -0.05; // faint background attraction
    greenWhiteForce = -0.18;  // mild neuron attraction (patrol near brain regions)

    // Yellow — ambient field: diffuse background that fills empty space
    yellowRedForce = -0.06;   // faint signal pull
    yellowGreenForce = -0.05; // faint inhibitor pull
    yellowYellowForce = -0.04;// very mild self-cohesion
    yellowWhiteForce = 0.18;  // pushed away from neuron clusters

    // White — neuron bodies: cluster into regions, but PUSH signals outward (fire!)
    whiteRedForce = 0.15;     // PUSH red signals away (asymmetric! creates orbits)
    whiteGreenForce = 0.08;   // push inhibitors out slightly
    whiteYellowForce = 0.12;  // push ambient field outward
    whiteWhiteForce = -0.28;  // moderate clustering into brain regions

    updateParticleSize('red', 3);
    updateParticleSize('green', 3);
    updateParticleSize('yellow', 2);
    updateParticleSize('white', 7);
    setTrailsAndRange(0.65, 90);
    setVortex(0.2);
});

// ── GPT-5.3 Codex — 2026 ───────────────────────────────────────────────

document.getElementById('PrismaticTide').addEventListener('click', () => {
    // A long-lived wave machine:
    // force relationships slowly shift over time to avoid a static equilibrium.
    activeDynamicPreset = 'PrismaticTide';
    presetPhase = 0;
    speedFactor = 0.9;

    redRedForce = -0.12;
    redGreenForce = 0.28;
    redYellowForce = -0.36;
    redWhiteForce = 0.22;

    greenRedForce = 0.28;
    greenGreenForce = -0.12;
    greenYellowForce = 0.22;
    greenWhiteForce = -0.36;

    yellowRedForce = -0.36;
    yellowGreenForce = 0.22;
    yellowYellowForce = -0.12;
    yellowWhiteForce = 0.28;

    whiteRedForce = 0.22;
    whiteGreenForce = -0.36;
    whiteYellowForce = 0.28;
    whiteWhiteForce = -0.12;

    updateParticleSize('red', 4);
    updateParticleSize('green', 4);
    updateParticleSize('yellow', 4);
    updateParticleSize('white', 4);
    setTrailsAndRange(0.72, 130);
    setVortex(0.34);
});

document.getElementById('CathedralBloom').addEventListener('click', () => {
    // A breathing architecture:
    // white cores contract/expand while colors swap between orbit and drift modes.
    activeDynamicPreset = 'CathedralBloom';
    presetPhase = 0;
    speedFactor = 0.65;

    redRedForce = 0.18;
    redGreenForce = -0.24;
    redYellowForce = -0.28;
    redWhiteForce = -0.44;

    greenRedForce = -0.24;
    greenGreenForce = 0.26;
    greenYellowForce = -0.2;
    greenWhiteForce = -0.3;

    yellowRedForce = -0.28;
    yellowGreenForce = -0.2;
    yellowYellowForce = 0.16;
    yellowWhiteForce = -0.46;

    whiteRedForce = 0.3;
    whiteGreenForce = -0.16;
    whiteYellowForce = 0.34;
    whiteWhiteForce = -0.5;

    updateParticleSize('red', 3);
    updateParticleSize('green', 3);
    updateParticleSize('yellow', 3);
    updateParticleSize('white', 6);
    setTrailsAndRange(0.82, 110);
    setVortex(0.22);
});

