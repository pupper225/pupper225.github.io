let canvas = document.getElementById("mainCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");

let playerCanvas = document.createElement("canvas");
let pContext = playerCanvas.getContext("2d");

let keys = {};
let playerPos = { x : canvas.width/2, y : canvas.height/2 };
let mousePos = { x:null, y:null };
let walls = [];
let lightOn = true;

function init(){
    //initialize player;
    playerCanvas.width = 50;
    playerCanvas.height = 50;
    pContext.beginPath();
    pContext.arc(25,25,25,0,2*Math.PI);
    pContext.fillStyle = '#ffd640';
    pContext.fill();

    //initialize walls
    for(let i = 0; i < 10; i++){
        let obj = 
        {
            p1:
            {
                x: Math.floor(Math.random() * canvas.width),
                y: Math.floor(Math.random() * canvas.height)
            },
            p2:
            {
                x: Math.floor(Math.random() * canvas.width),
                y: Math.floor(Math.random() * canvas.height)
            }
        }
        walls.push(obj);
    }
}

function getRayPoints(wall,playerPos,ray){
    let den = (wall.p1.x-wall.p2.x)*(playerPos.y-ray.y) - (wall.p1.y-wall.p2.y)*(playerPos.x-ray.x)
    if(Math.abs(den) < Number.EPSILON) return null;
    let t = ((wall.p1.x-playerPos.x)*(playerPos.y-ray.y)-(wall.p1.y-playerPos.y)*(playerPos.x-ray.x))/den;
    let u = ((wall.p1.x-wall.p2.x)*(wall.p1.y-playerPos.y)-(wall.p1.y-wall.p2.y)*(wall.p1.x-playerPos.x))/den;
    u *= -1;
    if(t > 0 && t < 1 && u > 0){
        let obj = {};
        obj.x = wall.p1.x+ (t*(wall.p2.x-wall.p1.x));
        obj.y = wall.p1.y+(t*(wall.p2.y-wall.p1.y));
        return [obj,u];
    }
    return null;

}

function drawWalls(){
    walls.forEach(item=>{
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(item.p1.x, item.p1.y);
        ctx.lineTo(item.p2.x, item.p2.y);
        ctx.stroke();
    })
}

function drawPlayer(){
    ctx.drawImage(pContext.canvas, playerPos.x, playerPos.y);
}

function drawRay(){
    for(let i =0; i < 360; i+=1){
        let rayPointsArr = [];
        let degInRad = i * (Math.PI/180);
        // let xDiff = mousePos.x - (playerPos.x + 25);
        // let yDiff = mousePos.y - (playerPos.y + 25);
    
        // let dist = Math.floor(Math.sqrt(xDiff**2+yDiff**2));
        // let x = playerPos.x+25+(xDiff/dist) * 1000;
        // let y = playerPos.y+25+(yDiff/dist) * 1000;
        let x = playerPos.x+ 25 +Math.cos(degInRad)*2000;
        let y = playerPos.x+ 25 +Math.sin(degInRad)*2000;
        
        walls.forEach(wall=>{
            let rayPoint = getRayPoints(wall ,{x:playerPos.x+25, y:playerPos.y+25},{x:x,y:y});
            
            if(rayPoint){
                rayPointsArr.push(rayPoint);
                // x = rayPoint.x;
                // y = rayPoint.y;
            }
        })
        if(rayPointsArr.length > 0){
            rayPointsArr.sort((first,second)=>first[1]-second[1]);
            x = rayPointsArr[0][0].x;
            y = rayPointsArr[0][0].y;
        }
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(playerPos.x+25, playerPos.y +25);
        ctx.lineTo(x,y);
        ctx.stroke();
    }
 
}

function update(){
    // document.onkeydown = (event)=>{
    //     keys[event.key] = true;
    // }
    // document.onkeyup = (event) =>{
    //     keys[event.key] = false;
    // }

    // if(keys['a']){
    //     playerPos.x -= 1;
    // }
    // if(keys['w']){
    //     playerPos.y -= 1;
    // }
    // if(keys['d']){
    //     playerPos.x += 1;   
    // }
    // if(keys['s']){
    //     playerPos.y += 1;
    // }

    document.addEventListener('contextmenu', event => {
        event.preventDefault();
    });

    document.onmousedown = (event)=>{
        if(event.buttons == 2) lightOn = !lightOn;
    }

    document.onmousemove = (event)=>{
        const rect = canvas.getBoundingClientRect();
        mousePos.x = event.clientX - rect.left;
        mousePos.y = event.clientY - rect.top;
        playerPos.x = mousePos.x - 25;
        playerPos.y = mousePos.y - 25;
    }
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawWalls();
    update();
    // drawPlayer();
    if(lightOn)drawRay();
    requestAnimationFrame(draw);
}
init();
draw();