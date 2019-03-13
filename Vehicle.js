import Vector from "../shared/engine/Vector2.js"
import Steering from "./Steering.js";
class Vehicle {
    constructor(x = 0, y = 0) {

        // Position
        this.velocity = new Vector;
        this.heading = new Vector;
        this.side = new Vector;
        this.position = new Vector(x, y);

        this.target = new Vector(x, y);
        this.lockedOn = {}; // Can lock onto other vehicles
        this.maxSpeed = 40;
        this.mass;
        this.maxForce = 40;
        this.maxTurnRate;
        this.wanderTarget = new Vector(0,1);

        this.behaviours = new Steering;
        this.steering = this.behaviours.seek;

        // Not quite implemented yet
        this.deceleration = 0.3;

        this.size = 10;

        this.init();
    }

    init() {
        this.mass = 1;
    }
    setTarget(target) {
        this.target = target;
    }
    steer() {

    }
    debug(renderer) {
        renderer.beginPath();
        renderer.strokeStyle="blue";
        renderer.moveTo(this.position.x + this.side.x*25, this.position.y + this.side.y*25);
        renderer.lineTo(this.position.x, this.position.y);
        renderer.lineTo(this.position.x + this.heading.x*40, this.position.y + this.heading.y * 40)
        renderer.stroke();
    }

    update(elapsedTime, gameWorld, renderer) {
        const steeringForce = this.steering();
        const acceleration = steeringForce.scaled(1/this.mass);
        this.velocity.add(acceleration.scaled(elapsedTime));

        this.velocity.truncate(this.maxSpeed);
        this.position.add(this.velocity.scaled(elapsedTime));

        const magSquared = this.velocity.x**2 + this.velocity.y**2;
        if(magSquared > 0.00000001) {
            this.heading = this.velocity.normalized();

            this.side = this.heading.perpendicularClockwise();
        }
        this.behaviours.obstacles(this, gameWorld, renderer);
        // console.log(this.heading.angle()/Math.PI*180);
        // console.log(this.heading);
    }
}

export default Vehicle;

//this.velocity.squared > 0.00000001