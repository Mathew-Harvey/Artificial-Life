

m=document.getElementById("life").getContext('2d')
draw=(x,y,c,s)=>{
    m.fillStyle=c
    m.fillRect(x, y, s, s)
}

particles=[]
//life is made up of atoms, it is the building block of our world, here we define
// particles. Each particle is a pixel that has postion, velocity and color
particle=(x,y,c)=>{
    return {"x":x, "y":y, "vx":0, "vy":0, "color":c}    
}

//First define the initial positions of each particle
random=()=>{
    return Math.random()*400+50
}

//then we create a group of particles
create=(number, color)=>{
    group=[]
    for(let i=0; i<number; i++){
        group.push(particle(random(), random(), color))
        particles.push(group[i])
    }
    return group
}

yellow = create(200, "yellow")

//define how to visualise the particles and add a time dimension by continuously updating
// the particles
update=()=>{
    m.clearRect(0,0,500,500)
    draw(0,0,"black", 500)
    for(i=0; i<particles.length; i++){
        draw(particles[i].x, particles[i].y, particles[i].color, 5)
    }
    requestAnimationFrame(update)

}
update();