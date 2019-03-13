import Vector from "../shared/engine/Vector2.js";

class World {
    constructor() {
        this.objects = [];
    }

    createBall(x, y, r) {
        // console.log(this);
        this.objects.push(
            {   type: "ball",
                radius: r,
                position: new Vector(x, y),
                tag: false
            })
    }
    render(renderer) {
        // console.log("rendering");
        this.objects.forEach(ball => {
            renderer.beginPath();
            // console.log(ball);
            if(ball.tag) renderer.fillStyle = "red";
            else renderer.fillStyle = "black";
            renderer.arc(ball.position.x, ball.position.y, ball.radius, 0, 2*Math.PI);
            renderer.fill();
        })
    }
    addBall() {
        this.createBall(Math.random()*800, Math.random() * 600, 20);
    }
    getObstacles(radius, center) {
        let obstacles = [];
        for(let i = 0; i < this.objects.length; i++) {            
            this.objects[i].tag = false;
            if(((this.objects[i].radius + radius)**2) > ((center.x-this.objects[i].position.x)**2 + (center.y -this.objects[i].position.y)**2)) {
                obstacles.push(this.objects[i]);
            }
        }
        return obstacles;
    }
}

export default World;