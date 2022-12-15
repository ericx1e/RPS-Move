let cells = [];
let boundX = 0;
let boundY = 0;
let boundXSpeed = 0.2;
let boundYSpeed = 0.1;

function preload() {
    icons = loadFont("fa.otf");
}

function setup() {
    let canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.position(0, 0);

    for (let i = 0; i < 600; i++) {
        cells[i] = new Cell(random(50, width - 50), random(50, height - 50), i % 3);
    }
}

function draw() {
    background(255);
    fill(51);
    noStroke();
    rectMode(CENTER);
    rect(width / 2, height / 2, width - boundX * 2, height - boundY * 2);
    boundX += boundXSpeed;
    boundY += boundYSpeed;

    cells.forEach(cell => {
        cell.show();
        cell.update();
    });

}

// Cell c = new Cell(x, y);
// c.pos

function Cell(x, y, team) {
    this.pos = createVector(x, y);
    this.team = team;
    // this.dir = random(0, 2 * PI);
    // this.size = random(5, 25);
    this.size = 15;
    this.speed = random(0.5, 1);

    this.show = function () {
        push();
        translate(this.pos.x, this.pos.y);
        textFont(icons);
        textAlign(CENTER, CENTER);
        textSize(this.size);
        switch (this.team) {
            case 0:
                fill(255, 50, 50);
                // text('\uf6de', 0, 0);
                break;
            case 1:
                fill(50, 255, 50);
                // text('\uf256', 0, 0);
                break;
            case 2:
                fill(50, 50, 255);
                // text('\uf257', 0, 0);
                break;

        }
        noStroke();
        ellipse(0, 0, this.size);
        pop();
    }

    this.update = function () {
        // this.vel.rotate(random(0, 2 * PI));
        this.vel = createVector(0, 0);

        let targetTo = createVector();
        let targetAway = createVector();
        let minDistTo = -1;
        let minDistAway = -1;
        cells.forEach(cell => {
            let dist = this.pos.dist(cell.pos);
            if ((this.team + 2) % 3 == cell.team) {
                if (minDistTo == -1 || dist < minDistTo) {
                    minDistTo = dist;
                    targetTo.x = cell.pos.x;
                    targetTo.y = cell.pos.y;
                }
            } else if ((this.team + 1) % 3 == cell.team) {
                if (minDistAway == -1 || dist < minDistAway) {
                    minDistAway = dist;
                    targetAway.x = cell.pos.x;
                    targetAway.y = cell.pos.y;
                }
            }
        });
        if (minDistTo == -1 && minDistAway == -1) return;
        if (minDistTo > 0) {
            this.vel = p5.Vector.sub(targetTo, this.pos).limit(this.speed).rotate(random(-PI / 4, PI / 4));
        }
        if (minDistAway > 0) {
            this.vel.add(p5.Vector.sub(this.pos, targetAway).limit(this.speed * 0.7).rotate(random(-PI / 4, PI / 4)));
        }
        this.pos.add(this.vel);
        this.checkCollision(cells);
        this.checkBoundaries();
    }

    this.checkCollision = function (others) {
        let squeezeVel = createVector(0, 0)
        for (let i = 0; i < others.length; i++) {
            other = others[i];
            if (other == this) {
                continue
            }
            let minDist = this.size / 2 + other.size / 2
            if (distSquared(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < minDist * minDist) {
                let moveVector = p5.Vector.sub(this.pos, other.pos).limit(this.speed * 0.5)
                squeezeVel.add(moveVector)
                other.pos.sub(moveVector)
                if ((this.team + 1) % 3 == other.team) {
                    other.team = this.team;
                }
            }
        }
        this.pos.add(squeezeVel)
    }

    this.checkBoundaries = function () {
        if (this.pos.x > width - boundX) {
            this.pos.add(createVector(-this.size / 2, 0))
        }
        if (this.pos.x < boundX) {
            this.pos.add(createVector(this.size / 2, 0))
        }
        if (this.pos.y > height - boundY) {
            this.pos.add(createVector(0, -this.size / 2))
        }
        if (this.pos.y < boundY) {
            this.pos.add(createVector(0, this.size / 2))
        }
    }
}

function mousePressed() {
    cells.push(new Cell(mouseX, mouseY));
}

function distSquared(x, y, x1, y1) { //faster than sqrt
    let dx = x1 - x;
    let dy = y1 - y;
    return dx * dx + dy * dy;
}