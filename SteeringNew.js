import Vector from "../shared/engine/Vector2.js";

class Steering {
    constructor() {
        this.arriveIsOn = false;
        this.seekIsOn = false;
        this.fleeIsOn = false;
        this.seekIsOn = false;
        this.wanderIsOn = false;
    };

    toggleArrive() {
        this.arriveIsOn =! this.arriveIsOn;
    }

    toggleSeek() {
        this.seekIsOn =! this.SeekIsOn;
    }

    toggleFlee() {
        this.fleeIsOn =! this.fleeIsOn;
    }

    togglePursuit() {
        this.pursuitIsOn =! this.pursuitIsOn;
    }


    seek() {
        // (target - position) scaled to maxSpeed, and then velocity is subtracted
        return this.target.subtracted(this.position)
            .normalized()
            .scaled(this.maxSpeed)
            .subtracted(this.velocity);
    }




    stopped() {
        return new Vector;
    }

    flee() {
        return this.position.subtracted(this.target.subtracted(this.position).normalized().scaled(this.maxSpeed));
    }
    arrive() {
        const distanceToTarget = this.target.subtracted(this.position);
        const distance = distanceToTarget.magnitude();

        if(distance > 0) {
            let speed = distance * this.deceleration;
            if(speed > this.maxSpeed) speed = this.maxSpeed;
            return distanceToTarget.scaled(speed/distance);
        }
        return new Vector;
    }
    pursuit() {
        const evader = this.lockedOn;
        const distanceToEvader = evader.position.subtracted(this.position);

        const relativeHeading = this.heading.dot(evader.heading);
        
        if((distanceToEvader.dot(this.heading) > 0)
            && relativeHeading < -0.95) { //acos(0.95) = 18 degrees;
                return this.target.subtracted(this.position).normalized().scaled(this.maxSpeed).subtracted(this.velocity);
            }
        const lookAheadTime = distanceToEvader.magnitude() / (this.maxSpeed + evader.maxSpeed);
        this.target = evader.position.added(evader.velocity.scaled(lookAheadTime)); 
         
        return this.target.subtracted(this.position).normalized().scaled(this.maxSpeed).subtracted(this.velocity);
    
    }

    evade() {
        const evader = this.lockedOn;
        const distanceToEvader = evader.position.subtracted(this.position);

        const relativeHeading = this.heading.dot(evader.heading);
        
        if((distanceToEvader.dot(this.heading) > 0)
            && relativeHeading < -0.95) { //acos(0.95) = 18 degrees;
                return this.target.subtracted(this.position).normalized().scaled(this.maxSpeed).subtracted(this.velocity);
            }
        const lookAheadTime = distanceToEvader.magnitude() / (this.maxSpeed + evader.maxSpeed);
        this.target = evader.position.added(evader.velocity.scaled(lookAheadTime)); 
         
        return this.target.subtracted(this.position).normalized().scaled(this.maxSpeed).subtracted(this.velocity);
    
    }

    wander() {
        // NOT WORKING
        const wanderRadius = 20;
        const wanderDistance = 2;
        const wanderJitter = 5;
        let wanderTarget = this.wanderTarget;
        let random1 = (Math.random() * 2) - 1;
        let random2 = (Math.random() * 2) - 1;
        // const wanderTarget = new Vector(this.position.x, this.position.y); // for testing 0?
        wanderTarget.add(new Vector(random1 * wanderJitter), random2 * wanderJitter);
        
        wanderTarget.normalize();
        wanderTarget.scale(wanderRadius);

        const targetLocal = new Vector(wanderTarget.x + wanderDistance, wanderTarget.y);
        const angle = this.heading.angle();
        const targetWorld = targetLocal.rotated(-angle);
        return targetWorld.subtracted(this.heading);
    }

    obstacles(self, gameWorld, renderer) {
        const minLength = 50;
        const boxLength = minLength + (self.velocity.magnitude() / self.maxSpeed) * minLength;
        let possibleTargets = gameWorld.getObstacles(boxLength, self.position);
        // renderer

        // Store the closest target
        let closestIntersectingObstacle = -1;
        let distanceToClosest = Infinity;
        let localPositionOfClosest;

        // Iterate through possible obstacles
        for(let idx = 0; idx < possibleTargets.length; idx++) {

            const localPos = possibleTargets[idx].position.inLocalSpace(self.position, self.heading);
            // Is localPos correct?

            if(localPos.x >= 0) {
                let planeWidth = 10/2;
                let expandedRadius = possibleTargets[idx].radius + planeWidth;

                if(Math.abs(localPos.y) < expandedRadius) {
                    const sqrtPart = Math.sqrt(expandedRadius**2 - localPos.y**2);

                    let IP = localPos.x - sqrtPart;
                    if(IP <= 0) {
                        IP = localPos.x + sqrtPart;                        
                    }

                    if(IP < distanceToClosest) {
                        distanceToClosest = IP;
                        closestIntersectingObstacle = possibleTargets[idx];
                        localPositionOfClosest = localPos;
                    }
                }
            }
        }
        if(closestIntersectingObstacle != -1) {
            closestIntersectingObstacle.tag = true;
            // alert(localPositionOfClosest.x + " and " + localPositionOfClosest.y);
        }   
    }
}

export default Steering;
