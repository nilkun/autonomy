import Viewport from "../shared/engine/Viewport2.js";
import Vehicle from "./Vehicle.js";
import World from "./GameWorld.js";

const seekButton = document.querySelector(".seek");
const fleeButton = document.querySelector(".flee");
const arriveButton = document.querySelector(".arrive");
const wanderButton = document.querySelector(".wander");
const addBallButton = document.querySelector(".addBall");

seekButton.addEventListener("click", () => plane.toggleSeek());
fleeButton.addEventListener("click", () => plane.toggleFlee());
arriveButton.addEventListener("click", () => plane.toggleArrive());
addBallButton.addEventListener("click", () => gameWorld.addBall());
wanderButton.addEventListener("click", () => plane.toggleWander());


const viewport = new Viewport(600, 300);

viewport.canvas.addEventListener("click", (event) => {
    const loc = viewport.getMouse(event);
    plane.target.set(loc.x, loc.y);
});

const plane = new Vehicle(200, 100);
const plane2 = new Vehicle(450, 150);
plane2.maxSpeed *= 0.6;
plane2.setTarget(plane.position);
plane2.lockedOn = plane;
plane2.steering = plane2.behaviours.pursuit;


const gameWorld = new World;
const renderer = viewport.context;
let currentTime = Date.now();
let lastTime = Date.now();
let elapsedTime = 0;
const loop = () => {
    lastTime = currentTime;
    currentTime = Date.now();
    elapsedTime = (currentTime - lastTime)/1000;
    // plane2.update(elapsedTime, gameWorld);
    viewport.clear();
    plane.update(elapsedTime, gameWorld, renderer);

    gameWorld.render(renderer);
    renderer.fillStyle="green";
    renderer.beginPath();
    renderer.arc(plane2.position.x, plane2.position.y, plane.size, 0, 2* Math.PI);
    renderer.stroke();    
    renderer.beginPath();
    renderer.arc(plane.position.x, plane.position.y, plane.size, 0, 2* Math.PI);
    renderer.fill();
    plane.debug(renderer);
    window.requestAnimationFrame(() => loop());
}

window.requestAnimationFrame(() => loop());
loop();