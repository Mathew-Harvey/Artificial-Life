// Global force variables
let speedFactor = 1.2;
let redForce = 0.3;
let greenForce = -0.5;
let yellowForce = 0.1;
let whiteForce = -0.4;
//preset 1 white dance
// let speedFactor = 1.5;
// let redForce = -.5;
// let greenForce = 0.2;
// let yellowForce = 0;
// let whiteForce = -.3;


// Get canvas context
let m = document.getElementById("life").getContext('2d');

// Function to draw a particle
function drawPracticle(x, y, c, s) {
    m.fillStyle = c;
    m.beginPath();
    m.arc(x, y, s / 2, 0, Math.PI * 2);
    m.fill();
}

// Function to draw a square (used for the canvas background)
function draw(x, y, c, s = 5) {
    m.fillStyle = c;
    m.fillRect(x, y, s, s);
}

// Array to store particles
let particles = [];

// Function to create a particle
function particle(x, y, c, s = 5) {
    return { "x": x, "y": y, "vx": 0, "vy": 0, "color": c, "size": s };
}

// Function to generate a random position
function random() {
    return Math.random() * 400 + 50;
}

// Function to create a group of particles
function create(number, color, size) {
    let group = [];
    for (let i = 0; i < number; i++) {
        group.push(particle(random(), random(), color, size));
        particles.push(group[i]);
    }
    return group;
}
// Gravitational rule function
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

            if (d > 0 && d < 80) {
                let F = force * 1 / d;
                fx += (F * dx);
                fy += (F * dy);
            }
        }

        a.vx = (a.vx + fx) * 0.5 * speedFactor;
        a.vy = (a.vy + fy) * 0.5 * speedFactor;
        a.x += a.vx * speedFactor;
        a.y += a.vy * speedFactor;

        if (a.x <= 0 || a.x >= 500) { a.vx *= -1; }
        if (a.y <= 0 || a.y >= 500) { a.vy *= -1; }
    }
}

// Create particle groups
let red = create(200, "red", 5);
let green = create(200, "green", 5);
let yellow = create(200, "yellow", 5);
let white = create(200, "white", 5);

// Update function with rules for particle interaction
function update() {
    rule(red, red, redForce);
    rule(red, green, greenForce);
    rule(red, yellow, yellowForce);
    rule(red, white, whiteForce);

    // Rules for green particles interacting with all colors
    rule(green, red, redForce);
    rule(green, green, greenForce);
    rule(green, yellow, yellowForce);
    rule(green, white, whiteForce);

    // Rules for yellow particles interacting with all colors
    rule(yellow, red, redForce);
    rule(yellow, green, greenForce);
    rule(yellow, yellow, yellowForce);
    rule(yellow, white, whiteForce);

    // Rules for white particles interacting with all colors
    rule(white, red, redForce);
    rule(white, green, greenForce);
    rule(white, yellow, yellowForce);
    rule(white, white, whiteForce);

    // Clear and redraw canvas
    m.clearRect(0, 0, 500, 500);
    draw(0, 0, "black", 500);
    for (let i = 0; i < particles.length; i++) {
        drawPracticle(particles[i].x, particles[i].y, particles[i].color, particles[i].size);
    }
    requestAnimationFrame(update);
}

// Start the animation loop
update();
// Function to update particle size based on slider input
function updateParticleSize(color, newSize) {
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].color === color) {
            particles[i].size = newSize;
        }
    }
}


document.getElementById('force-slider-red').addEventListener('input', (event) => {
    redForce = parseFloat(event.target.value);
    localStorage.setItem('redForce', redForce);
});

document.getElementById('force-slider-yellow').addEventListener('input', (event) => {
    yellowForce = parseFloat(event.target.value);
    localStorage.setItem('yellowForce', yellowForce);
});

document.getElementById('force-slider-green').addEventListener('input', (event) => {
    greenForce = parseFloat(event.target.value);
    localStorage.setItem('greenForce', greenForce);
});

document.getElementById('force-slider-white').addEventListener('input', (event) => {
    whiteForce = parseFloat(event.target.value);
    localStorage.setItem('whiteForce', whiteForce);
});


// Event listeners for slider controls
// Event listeners for slider controls
document.addEventListener("DOMContentLoaded", function () {
    ['red', 'green', 'yellow', 'white'].forEach(color => {
        // Size slider event listener
        document.getElementById(`size-slider-${color}`).addEventListener('input', (event) => {
            let value = parseInt(event.target.value);
            updateParticleSize(color, value);
            localStorage.setItem(`size-${color}`, value);
        });



    });

    // Load saved values
    loadSliderValues();
});

// Speed factor slider event listener
document.getElementById('speedFactor-slider').addEventListener('input', (event) => {
    speedFactor = parseFloat(event.target.value);
    localStorage.setItem('speedFactor', speedFactor);
});

// Load saved speed factor value
if (localStorage.getItem('speedFactor')) {
    speedFactor = parseFloat(localStorage.getItem('speedFactor'));
    document.getElementById('speedFactor-slider').value = speedFactor;
}
