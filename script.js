

// Function to update particle size
function updateParticleSize(color, newSize) {
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].color === color) {
            particles[i].size = newSize;
        }
    }
}

// Function to load saved slider values and apply them
function loadSliderValues() {
    ['red', 'green', 'yellow', 'white'].forEach(color => {
        if (localStorage.getItem(`size-${color}`)) {
            let size = parseInt(localStorage.getItem(`size-${color}`));
            document.getElementById(`size-slider-${color}`).value = size;
            updateParticleSize(color, size);
        }
        if (localStorage.getItem(`attraction-${color}`)) {
            let attraction = parseFloat(localStorage.getItem(`attraction-${color}`));
            document.getElementById(`attraction-slider-${color}`).value = attraction;
            window[`${color}Attraction`] = attraction;
        }
        if (localStorage.getItem(`repulsion-${color}`)) {
            let repulsion = parseFloat(localStorage.getItem(`repulsion-${color}`));
            document.getElementById(`repulsion-slider-${color}`).value = repulsion;
            window[`${color}Repulsion`] = repulsion;
        }
    });
    
}

// Event listeners and localStorage for all sliders
document.addEventListener("DOMContentLoaded", function() {
    ['red', 'green', 'yellow', 'white'].forEach(color => {
        document.getElementById(`size-slider-${color}`).addEventListener('input', (event) => {
            let value = parseInt(event.target.value);
            updateParticleSize(color, value);
            localStorage.setItem(`size-${color}`, value);
        });

        document.getElementById(`attraction-slider-${color}`).addEventListener('input', (event) => {
            let value = parseFloat(event.target.value);
            window[`${color}Attraction`] = value;
            localStorage.setItem(`attraction-${color}`, value);
        });

        document.getElementById(`repulsion-slider-${color}`).addEventListener('input', (event) => {
            let value = parseFloat(event.target.value);
            window[`${color}Repulsion`] = value;
            localStorage.setItem(`repulsion-${color}`, value);
        });
    });

    // Load saved values
    loadSliderValues();
});

//phyiscs engine
let speedFactor = 1
let redAttraction = 0, redRepulsion = 0
let yellowAttraction = 0, yellowRepulsion = 0
let whiteAttraction = 0, whiteRepulsion = 0
let greenAttraction = 0, greenRepulsion = 0




m = document.getElementById("life").getContext('2d')
drawPracticle = (x, y, c, s) => {
    m.fillStyle = c;
    m.beginPath();
    m.arc(x, y, s / 2, 0, Math.PI * 2);
    m.fill();
}

draw = (x, y, c, s=5) => {
    m.fillStyle = c;
    m.fillRect(x, y, s, s);
}

particles = []
//life is made up of atoms, it is the building block of our world, here we define
// particles. Each particle is a pixel that has postion, velocity and color
particle = (x, y, c, s=5) => {
    return { "x": x, "y": y, "vx": 0, "vy": 0, "color": c, "size":s }
}

//First define the initial positions of each particle
random = () => {
    return Math.random() * 400 + 50
}

//then we create a group of particles
create = (number, color, size) => {
    group = []
    for (let i = 0; i < number; i++) {
        group.push(particle(random(), random(), color, size))
        particles.push(group[i])
    }
    return group
}
//gravitational rule (newtons law of attraction, assume all particles have a mass of 1 and lets ignore the sqrt 
rule = (particles1, particles2, g) => {
    //let all particles attract each other
    for (let i=0; i < particles1.length; i++) {
        //set initial force to 0
        fx = 0
        fy = 0
        for (let j=0; j < particles2.length; j++) {
            a = particles1[i]
            b = particles2[j]
            dx = a.x-b.x
            dy = a.y-b.y
            // calculate the distance between each particle useing pythagorans
            d = Math.sqrt(dx * dx + dy * dy)

            //check if there is distance
            if (d > 0 && d < 80) {
                if (a.color === 'red' && b.color === 'red') {
                    F = (g + redAttraction - redRepulsion) * 1 / d;
                } else if (a.color === 'green' && b.color === 'green') {
                    F = (g + greenAttraction - greenRepulsion) * 1 / d;
                } else if (a.color === 'yellow' && b.color === 'yellow') {
                    F = (g + yellowAttraction - yellowRepulsion) * 1 / d;
                } else if (a.color === 'white' && b.color === 'white') {
                    F = (g + whiteAttraction - whiteRepulsion) * 1 / d;
                } else {
                F = g * 1 / d
                }
                // distribute force between x and y axis
                fx += (F * dx)
                fy += (F * dy)
            }
        }
        
        //add acceleration as particles get closer
        a.vx = (a.vx + fx)*0.5*speedFactor
        a.vy = (a.vy + fy)*0.5*speedFactor
        //update position base on existing force
        a.x += a.vx*speedFactor
        a.y += a.vy*speedFactor
        //prevent particles from leaving the canvas
        if(a.x <= 0 || a.x >=500){a.vx *=-1}
        if(a.y <= 0 || a.y >=500){a.vy *=-1}
    }
}

//create particles
yellow = create(200, "yellow", 5)
red = create(200, "red", 5)
green = create(200, "green", 5)
white = create (200, "white", 5)

//define how to visualise the particles and add a time dimension by 
//continuously updating the particles
update = () => {
    //in the world of atoms there is repulsion as well as attraction, the 3
    //parameter in the rule can adjust this, -1 is attract , 1 is repell
    rule(red, red, -0.1) // the red particles attract the red particles 
    rule(red, yellow, -0.01) // the red particle attrack the yellow particles by a small force
    rule(yellow, red, 0.01) // the yellow repels the red a little bit
    rule(green, green, -0.7)
    rule(green, red, -0.2)
    rule(red, green, -0.1)

   // This model produces a flying creature with wings , head and tail. 
   // could be related to Stephen Wolfram's concept of irreducibility
    // rule(green, green, -0.32)
    // rule(green, red, -0.17)
    // rule(green, yellow, 0.34)
    // rule(red, red, -0.10)
    // rule(red, green, -0.34)
    // rule(yellow, yellow, 0.15)
    // rule(yellow, green, -0.20 )
    // rule(white, yellow, -0.06)
    // rule(white, green, 0.03)
    // rule(white, red, -0.07)


    m.clearRect(0, 0, 500, 500)
    draw(0, 0, "black", 500)
    for (i = 0; i < particles.length; i++) {
        drawPracticle(particles[i].x, particles[i].y, particles[i].color, particles[i].size)
    }
    requestAnimationFrame(update)

}
update();

// can i model the attractive properties of each particle type in the periodic table??


//ui controls: 
//size
function updateParticleSize(color, newSize) {
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].color === color) {
            particles[i].size = newSize;
        }
    }
}

document.getElementById('speedFactor-slider').addEventListener('input', (event) => {
    speedFactor = parseFloat(event.target.value);
});

document.addEventListener("DOMContentLoaded", function() {
    ['red', 'green', 'yellow', 'white'].forEach(color => {
        document.getElementById(`size-slider-${color}`).addEventListener('input', (event) => {
            let value = parseInt(event.target.value);
            updateParticleSize(color, value);
            localStorage.setItem(`size-${color}`, value);
        });

        document.getElementById(`attraction-slider-${color}`).addEventListener('input', (event) => {
            let value = parseFloat(event.target.value);
            window[`${color}Attraction`] = value;
            localStorage.setItem(`attraction-${color}`, value);
        });

        document.getElementById(`repulsion-slider-${color}`).addEventListener('input', (event) => {
            let value = parseFloat(event.target.value);
            window[`${color}Repulsion`] = value;
            localStorage.setItem(`repulsion-${color}`, value);
        });
    });

    // Load saved values
    loadSliderValues();
});