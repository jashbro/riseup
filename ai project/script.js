const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    draw() {
        ctx.fillStyle = '#FF0';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    flap() {
        this.velocity += this.lift;
    }
};

const pipes = [];
const pipeWidth = 40;
const pipeGap = 150;
let frame = 0;
let score = 0;

function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
    pipes.push({
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: pipeHeight
    });
    pipes.push({
        x: canvas.width,
        y: pipeHeight + pipeGap,
        width: pipeWidth,
        height: canvas.height - pipeHeight - pipeGap
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = '#0F0';
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
        pipe.x -= 2;
    });

    if (pipes.length && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        pipes.shift();
        score++;
    }
}

function detectCollision() {
    for (let i = 0; i < pipes.length; i++) {
        if (
            bird.x < pipes[i].x + pipes[i].width &&
            bird.x + bird.width > pipes[i].x &&
            bird.y < pipes[i].y + pipes[i].height &&
            bird.y + bird.height > pipes[i].y
        ) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    ctx.fillStyle = '#000';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', 100, 300);
    ctx.fillText('Score: ' + score, 100, 350);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.draw();
    bird.update();

    if (frame % 100 === 0) {
        createPipe();
    }
    drawPipes();

    if (detectCollision()) {
        gameOver();
        return;
    }

    frame++;
    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        bird.flap();
    }
});

update();
