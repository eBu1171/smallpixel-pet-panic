let pet, petSprite, burgerSprite, pizzaSprite, bookSprite, clockSprite;
let foods = [];
let stressors = [];
let energy = 100;
let maxEnergy = 100;
let score = 0;
let gameOver = false;
let moodChangeInterval = 5 * 60; // 5 seconds at 60fps
let nextMoodChange;
let gameTitle;
let shareButton;
let aiQuotes = [
    "I'm not just a pet, I'm an AI companion!",
    "Feed me data... I mean burgers!",
    "My neural networks need pizza to function!",
    "Too much studying causes AI burnout!",
    "Time management is crucial for AI and humans alike!",
    "Is this what they call artificial hunger?",
    "My algorithm prefers pizza over burgers!",
    "Help me avoid digital stress!",
    "I'm learning your feeding patterns..."
];
let currentQuote = "";
let quoteTimer = 0;
let quoteInterval = 7 * 60; // 7 seconds
let particles = [];
let gameStarted = false;
let highScore = 0;

function setup() {
    createCanvas(800, 600);

    // Create title graphic
    gameTitle = createGraphics(600, 100);
    drawGameTitle(gameTitle);

    // Create sprite Graphics (all scaled appropriately)
    petSprite = createGraphics(160, 160);
    burgerSprite = createGraphics(80, 80);
    pizzaSprite = createGraphics(80, 80);
    bookSprite = createGraphics(80, 80);
    clockSprite = createGraphics(80, 80);

    // Draw sprites
    drawPetSprite(petSprite);
    drawBurgerSprite(burgerSprite);
    drawPizzaSprite(pizzaSprite);
    drawBookSprite(bookSprite);
    drawClockSprite(clockSprite);

    // Initialize pet
    pet = {
        x: 100,
        y: 250,
        width: 160,
        height: 160,
        speed: 5,
        mood: random(['happy', 'grumpy', 'chaos'])
    };

    nextMoodChange = moodChangeInterval;

    // Create share button
    shareButton = createButton('Share on X');
    shareButton.position(width - 120, height - 50);
    shareButton.mousePressed(shareScore);
    shareButton.style('background-color', '#1DA1F2');
    shareButton.style('color', 'white');
    shareButton.style('border', 'none');
    shareButton.style('padding', '10px 15px');
    shareButton.style('border-radius', '20px');
    shareButton.style('font-weight', 'bold');
    shareButton.style('cursor', 'pointer');
    shareButton.hide();

    // Load high score from local storage if available
    if (localStorage.getItem('pixelPetPanicHighScore')) {
        highScore = parseInt(localStorage.getItem('pixelPetPanicHighScore'));
    }

    // Set initial quote
    currentQuote = random(aiQuotes);
}

function drawGameTitle(g) {
    g.background(0, 0, 0, 0);
    g.textSize(60);
    g.textAlign(CENTER);
    g.textStyle(BOLD);

    // Shadow
    g.fill(0, 100);
    g.text("PIXEL PET PANIC", 305, 65);

    // Gradient text
    for (let i = 0; i < 60; i++) {
        let c = lerpColor(color(255, 50, 50), color(50, 50, 255), i / 60);
        g.fill(c);
        g.text("PIXEL PET PANIC", 300, 60 - i / 2);
    }

    // AI tag
    g.textSize(20);
    g.fill(50, 205, 50);
    g.text("AI EDITION", 300, 85);
}

function drawPetSprite(g) {
    g.clear(); // Clear the graphics
    g.noStroke();

    // More appealing pet with rounded shape and gradient
    let mainColor = color(255, 100, 100); // Brighter red
    let highlightColor = color(255, 150, 150); // Highlight color

    // Draw body (circular)
    g.fill(mainColor);
    g.ellipse(80, 80, 120, 120);

    // Highlight
    g.fill(highlightColor);
    g.ellipse(65, 65, 40, 40);

    // Eyes (larger, more expressive)
    g.fill(255);
    g.ellipse(60, 70, 25, 30);
    g.ellipse(100, 70, 25, 30);

    // Pupils (that follow mouse for interactivity)
    g.fill(0);
    let eyeX1 = constrain(mouseX / width * 10 - 5, -5, 5);
    let eyeY1 = constrain(mouseY / height * 10 - 5, -5, 5);
    g.ellipse(60 + eyeX1, 70 + eyeY1, 12, 15);
    g.ellipse(100 + eyeX1, 70 + eyeY1, 12, 15);

    // Mouth (smile or different based on mood)
    g.noFill();
    g.stroke(0);
    g.strokeWeight(3);
    if (pet && pet.mood === 'happy') {
        g.arc(80, 95, 50, 30, 0, PI);
    } else if (pet && pet.mood === 'grumpy') {
        g.arc(80, 105, 50, 30, PI, TWO_PI);
    } else {
        // Chaos mood - zigzag mouth
        g.beginShape();
        g.vertex(55, 95);
        g.vertex(65, 105);
        g.vertex(75, 95);
        g.vertex(85, 105);
        g.vertex(95, 95);
        g.vertex(105, 105);
        g.endShape();
    }

    // Add some personality features
    g.noStroke();
    g.fill(255, 50, 50);
    g.ellipse(80, 50, 15, 15); // Little antenna/horn
}

function drawBurgerSprite(g) {
    g.clear();
    g.noStroke();

    // Top bun (rounded)
    g.fill(240, 180, 80);
    g.arc(40, 25, 60, 30, PI, TWO_PI);
    g.rect(10, 25, 60, 10);

    // Sesame seeds
    g.fill(250, 240, 190);
    g.ellipse(25, 18, 5, 7);
    g.ellipse(40, 15, 5, 7);
    g.ellipse(55, 18, 5, 7);

    // Lettuce
    g.fill(100, 220, 50);
    g.beginShape();
    for (let x = 10; x <= 70; x += 5) {
        g.vertex(x, 35 + sin(x * 0.5) * 3);
    }
    g.vertex(70, 45);
    g.vertex(10, 45);
    g.endShape(CLOSE);

    // Tomato
    g.fill(255, 50, 50);
    g.rect(15, 45, 50, 7);

    // Cheese
    g.fill(255, 200, 50);
    g.rect(12, 52, 56, 5);
    g.triangle(12, 52, 12, 57, 5, 57);
    g.triangle(68, 52, 68, 57, 75, 57);

    // Patty
    g.fill(120, 60, 10);
    g.ellipse(40, 62, 60, 15);

    // Bottom bun
    g.fill(240, 180, 80);
    g.arc(40, 70, 60, 20, 0, PI);
    g.rect(10, 60, 60, 10);
}

function drawPizzaSprite(g) {
    g.clear();
    g.noStroke();

    // Crust
    g.fill(240, 200, 120);
    g.triangle(5, 75, 40, 5, 75, 75);

    // Sauce and cheese base
    g.fill(250, 180, 80);
    g.triangle(10, 70, 40, 15, 70, 70);

    // Tomato sauce showing through
    g.fill(220, 50, 50);
    for (let i = 0; i < 5; i++) {
        let x = random(15, 65);
        let y = map(x, 15, 65, 60, 60);
        if (abs(x - 40) < 25) {
            y = map(abs(x - 40), 0, 25, 20, 60);
        }
        g.ellipse(x, y, 5, 5);
    }

    // Pepperoni
    g.fill(200, 30, 30);
    g.ellipse(30, 40, 12, 12);
    g.ellipse(50, 40, 12, 12);
    g.ellipse(40, 55, 12, 12);

    // Cheese drips
    g.stroke(250, 220, 120);
    g.strokeWeight(2);
    for (let x = 20; x < 60; x += 10) {
        let startY = (x < 40) ? map(x, 20, 40, 65, 40) : map(x, 40, 60, 40, 65);
        g.line(x, startY, x + random(-3, 3), startY + random(5, 10));
    }
}

function drawBookSprite(g) {
    g.clear();

    // Book cover
    g.fill(20, 50, 120);
    g.rect(15, 15, 50, 60, 3);

    // Book binding
    g.fill(10, 30, 80);
    g.rect(10, 15, 10, 60, 3, 0, 0, 3);

    // Pages
    g.fill(250);
    g.rect(20, 20, 40, 50);

    // Text lines
    g.stroke(150);
    g.strokeWeight(1);
    for (let y = 25; y < 65; y += 7) {
        g.line(25, y, 55, y);
    }

    // Title
    g.noStroke();
    g.fill(220, 180, 50);
    g.rect(25, 30, 30, 8);

    // AI symbol
    g.stroke(50, 120, 200);
    g.strokeWeight(2);
    g.noFill();
    g.ellipse(40, 50, 20, 20);
    g.line(40, 40, 40, 60);
    g.line(30, 50, 50, 50);
}

function drawClockSprite(g) {
    g.clear();

    // Clock face
    g.fill(240);
    g.stroke(50);
    g.strokeWeight(2);
    g.ellipse(40, 40, 60, 60);

    // Clock rim
    g.noFill();
    g.stroke(150);
    g.strokeWeight(4);
    g.ellipse(40, 40, 65, 65);

    // Hour marks
    g.stroke(0);
    g.strokeWeight(2);
    for (let i = 0; i < 12; i++) {
        let angle = i * PI / 6;
        let x1 = 40 + cos(angle) * 25;
        let y1 = 40 + sin(angle) * 25;
        let x2 = 40 + cos(angle) * 30;
        let y2 = 40 + sin(angle) * 30;
        g.line(x1, y1, x2, y2);
    }

    // Clock hands
    g.stroke(0);
    g.strokeWeight(3);
    // Hour hand
    let hourAngle = map((hour() % 12), 0, 12, 0, TWO_PI) - HALF_PI;
    g.line(40, 40, 40 + cos(hourAngle) * 15, 40 + sin(hourAngle) * 15);

    // Minute hand
    g.strokeWeight(2);
    let minuteAngle = map(minute(), 0, 60, 0, TWO_PI) - HALF_PI;
    g.line(40, 40, 40 + cos(minuteAngle) * 20, 40 + sin(minuteAngle) * 20);

    // Second hand
    g.stroke(255, 0, 0);
    g.strokeWeight(1);
    let secondAngle = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
    g.line(40, 40, 40 + cos(secondAngle) * 25, 40 + sin(secondAngle) * 25);

    // Center dot
    g.fill(0);
    g.noStroke();
    g.ellipse(40, 40, 5, 5);
}

function draw() {
    // Background gradient
    let c1 = color(100, 180, 255);
    let c2 = color(70, 120, 200);
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(0, y, width, y);
    }

    // Ground with texture
    noStroke();
    fill(30, 160, 30);
    rect(0, 500, width, 100);

    // Ground texture
    fill(20, 140, 20);
    for (let x = 0; x < width; x += 30) {
        ellipse(x, 500 + random(5), random(30, 60), random(10, 20));
    }

    if (!gameStarted) {
        // Start screen
        image(gameTitle, 100, 100);

        // Animated pet
        image(petSprite, width / 2 - 80, 250);

        // Start button
        fill(50, 200, 100);
        stroke(255);
        strokeWeight(3);
        rect(width / 2 - 100, 400, 200, 60, 20);

        fill(255);
        noStroke();
        textSize(30);
        textAlign(CENTER);
        text("START", width / 2, 440);

        // High score display
        textSize(20);
        text("High Score: " + highScore, width / 2, 480);

        // Instructions
        textSize(16);
        text("Use UP/DOWN arrows to move. Collect food, avoid stressors!", width / 2, 520);

        // Check for start button click
        if (mouseIsPressed &&
            mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
            mouseY > 400 && mouseY < 460) {
            gameStarted = true;
            resetGame();
        }

        return;
    }

    if (gameOver) {
        // Game over screen with animation
        background(0, 0, 0, 150);

        // Particles
        updateParticles();

        textSize(60);
        fill(255, 0, 0);
        textAlign(CENTER);
        text("Game Over", width / 2, height / 2 - 50);

        textSize(30);
        fill(255);
        text("Score: " + score, width / 2, height / 2 + 20);

        // New high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('pixelPetPanicHighScore', highScore);

            textSize(25);
            fill(255, 255, 0);
            text("NEW HIGH SCORE!", width / 2, height / 2 + 60);
        } else {
            textSize(20);
            fill(200);
            text("High Score: " + highScore, width / 2, height / 2 + 60);
        }

        // Restart button
        fill(50, 200, 100);
        stroke(255);
        strokeWeight(3);
        rect(width / 2 - 100, height / 2 + 80, 200, 50, 15);

        fill(255);
        noStroke();
        textSize(25);
        text("Play Again", width / 2, height / 2 + 115);

        // Show share button
        shareButton.show();

        // Check for restart button click
        if (mouseIsPressed &&
            mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
            mouseY > height / 2 + 80 && mouseY < height / 2 + 130) {
            resetGame();
        }

        return;
    }

    // Hide share button during gameplay
    shareButton.hide();

    // Pet movement
    let direction = 0;
    if (keyIsDown(UP_ARROW)) direction = -1;  // Always move up with up arrow
    else if (keyIsDown(DOWN_ARROW)) direction = 1;  // Always move down with down arrow

    // Apply mood effects to speed only, not direction
    let speedFactor = pet.mood === 'happy' ? 1.5 : pet.mood === 'grumpy' ? 0.5 : 1;

    // For 'chaos' mood, we can add a small random movement but preserve main direction
    if (pet.mood === 'chaos' && direction !== 0) {
        // Add slight randomness to movement in chaos mood
        pet.y += direction * pet.speed * speedFactor + random(-2, 2);
    } else {
        pet.y += direction * pet.speed * speedFactor;
    }
    pet.y = constrain(pet.y, 0, 500 - pet.height);

    // Mood change
    if (frameCount >= nextMoodChange) {
        pet.mood = random(['happy', 'grumpy', 'chaos']);
        nextMoodChange = frameCount + moodChangeInterval;

        // Create mood change effect
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: pet.x + pet.width / 2,
                y: pet.y + pet.height / 2,
                vx: random(-3, 3),
                vy: random(-3, 3),
                size: random(5, 10),
                color: pet.mood === 'happy' ? color(50, 255, 50) :
                    pet.mood === 'grumpy' ? color(255, 50, 50) :
                        color(255, 255, 0),
                life: 60
            });
        }
    }

    // Update AI quotes
    if (frameCount >= quoteTimer) {
        currentQuote = random(aiQuotes);
        quoteTimer = frameCount + quoteInterval;
    }

    // Spawn items with increasing difficulty
    let foodSpawnRate = 0.01 + (score / 1000); // Increases with score
    let stressorSpawnRate = 0.005 + (score / 500); // Increases faster with score

    if (random() < foodSpawnRate) {
        foods.push({
            x: width,
            y: random(0, 500 - 80),
            width: 80,
            height: 80,
            type: random(['burger', 'pizza']),
            speed: 3 + (score / 100) // Speed increases with score
        });
    }

    if (random() < stressorSpawnRate) {
        stressors.push({
            x: width,
            y: random(0, 500 - 80),
            width: 80,
            height: 80,
            type: random(['book', 'clock']),
            speed: 3 + (score / 100) // Speed increases with score
        });
    }

    // Update particles
    updateParticles();

    // Update and draw foods with effects
    for (let i = foods.length - 1; i >= 0; i--) {
        let f = foods[i];
        f.x -= f.speed;

        // Add subtle floating motion
        f.y += sin(frameCount * 0.1 + i) * 0.5;

        // Draw glow effect
        drawGlow(f.x, f.y, 80, 80, color(255, 255, 100, 50));

        image(f.type === 'burger' ? burgerSprite : pizzaSprite, f.x, f.y);

        if (collision(pet, f)) {
            score += 1;
            energy = min(energy + 5, maxEnergy);
            foods.splice(i, 1);

            // Create particle effect for food collection
            for (let j = 0; j < 15; j++) {
                particles.push({
                    x: f.x + f.width / 2,
                    y: f.y + f.height / 2,
                    vx: random(-2, 2),
                    vy: random(-2, 2),
                    size: random(3, 8),
                    color: color(255, 255, 0),
                    life: 40
                });
            }

            // Show score popup
            particles.push({
                x: f.x + f.width / 2,
                y: f.y,
                vx: 0,
                vy: -1,
                size: 20,
                text: "+1",
                color: color(50, 255, 50),
                life: 60
            });

        } else if (f.x < -f.width) {
            foods.splice(i, 1);
        }
    }

    // Update and draw stressors with effects
    for (let i = stressors.length - 1; i >= 0; i--) {
        let s = stressors[i];
        s.x -= s.speed;

        // Add subtle rotation effect
        push();
        translate(s.x + s.width / 2, s.y + s.height / 2);
        rotate(frameCount * 0.01);

        // Draw warning glow
        drawGlow(0, 0, 80, 80, color(255, 0, 0, 50));

        image(s.type === 'book' ? bookSprite : clockSprite, -s.width / 2, -s.height / 2);
        pop();

        if (collision(pet, s)) {
            energy -= 10;
            stressors.splice(i, 1);

            // Create particle effect for stress
            for (let j = 0; j < 15; j++) {
                particles.push({
                    x: s.x + s.width / 2,
                    y: s.y + s.height / 2,
                    vx: random(-3, 3),
                    vy: random(-3, 3),
                    size: random(5, 10),
                    color: color(255, 0, 0),
                    life: 50
                });
            }

            // Show energy loss popup
            particles.push({
                x: s.x + s.width / 2,
                y: s.y,
                vx: 0,
                vy: -1,
                size: 20,
                text: "-10",
                color: color(255, 50, 50),
                life: 60
            });

        } else if (s.x < -s.width) {
            stressors.splice(i, 1);
        }
    }

    // Draw pet with mood indicator
    drawPetSprite(petSprite); // Redraw to update expression based on mood
    image(petSprite, pet.x, pet.y);

    // Mood indicator
    let moodColor = pet.mood === 'happy' ? color(50, 255, 50) :
        pet.mood === 'grumpy' ? color(255, 50, 50) :
            color(255, 255, 0);
    fill(moodColor);
    noStroke();
    ellipse(pet.x + pet.width - 20, pet.y + 20, 20, 20);

    // Energy bar with gradient and animation
    drawEnergyBar(10, 10, 200, 20, energy / maxEnergy);

    // Score display with animation
    fill(0);
    stroke(255);
    strokeWeight(2);
    textSize(24);
    textAlign(LEFT);
    text(`Score: ${score}`, 10, 60);

    // Mood text
    fill(moodColor);
    noStroke();
    textSize(18);
    text(`Mood: ${pet.mood}`, 10, 90);

    // Display AI quote in speech bubble
    drawSpeechBubble(pet.x + pet.width, pet.y, currentQuote);

    // Game over check
    if (energy <= 0) {
        gameOver = true;

        // Create explosion effect
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: pet.x + pet.width / 2,
                y: pet.y + pet.height / 2,
                vx: random(-5, 5),
                vy: random(-5, 5),
                size: random(5, 15),
                color: color(255, random(0, 255), 0),
                life: 120
            });
        }
    }
}

function drawGlow(x, y, w, h, glowColor) {
    noStroke();
    fill(glowColor);
    for (let i = 3; i > 0; i--) {
        let size = i * 5;
        ellipse(x + w / 2, y + h / 2, w + size, h + size);
    }
}

function drawEnergyBar(x, y, w, h, percent) {
    // Background
    noStroke();
    fill(50);
    rect(x, y, w, h, h / 2);

    // Energy gradient
    if (percent > 0) {
        for (let i = 0; i < w * percent; i++) {
            let inter = map(i, 0, w, 0, 1);
            let c = lerpColor(color(255, 0, 0), color(0, 255, 0), inter);
            stroke(c);
            line(x + i, y, x + i, y + h);
        }
    }

    // Pulsing effect when low
    if (percent < 0.3) {
        let pulse = sin(frameCount * 0.2) * 5;
        stroke(255, 0, 0, 150);
        strokeWeight(pulse);
        noFill();
        rect(x, y, w, h, h / 2);
        strokeWeight(1);
    }

    // Border
    stroke(255);
    strokeWeight(2);
    noFill();
    rect(x, y, w, h, h / 2);
}

function drawSpeechBubble(x, y, text) {
    let bubbleWidth = 200;
    let bubbleHeight = 60;
    let bubbleX = x - bubbleWidth + 20;
    let bubbleY = y - 30;

    // Check if bubble would go off screen
    if (bubbleX < 10) bubbleX = 10;
    if (bubbleX + bubbleWidth > width - 10) bubbleX = width - bubbleWidth - 10;

    // Draw bubble
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 10);

    // Draw pointer
    fill(255);
    noStroke();
    triangle(
        x, y,
        bubbleX + bubbleWidth - 30, bubbleY + bubbleHeight,
        bubbleX + bubbleWidth - 10, bubbleY + bubbleHeight - 10
    );
    stroke(0);
    strokeWeight(2);
    line(
        x, y,
        bubbleX + bubbleWidth - 30, bubbleY + bubbleHeight
    );
    line(
        x, y,
        bubbleX + bubbleWidth - 10, bubbleY + bubbleHeight - 10
    );

    // Draw text
    fill(0);
    noStroke();
    textSize(14);
    textAlign(LEFT);
    text(text, bubbleX + 10, bubbleY + 20, bubbleWidth - 20, bubbleHeight - 20);
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.text) {
            // Text particle
            fill(p.color);
            textSize(p.size);
            textAlign(CENTER);
            text(p.text, p.x, p.y);
        } else {
            // Regular particle
            noStroke();
            fill(p.color);
            ellipse(p.x, p.y, p.size, p.size);
        }

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function resetGame() {
    energy = 100;
    score = 0;
    gameOver = false;
    foods = [];
    stressors = [];
    particles = [];
    gameStarted = true;

    // Reset pet
    pet.x = 100;
    pet.y = 250;
    pet.mood = random(['happy', 'grumpy', 'chaos']);

    nextMoodChange = frameCount + moodChangeInterval;
    quoteTimer = frameCount + quoteInterval;
    currentQuote = random(aiQuotes);
}

function shareScore() {
    let tweetText = `I scored ${score} points in Pixel Pet Panic: AI Edition! Can you beat my score? #PixelPetPanic #AIGames`;
    let tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
}

function collision(a, b) {
    // Define hitbox adjustments for each sprite type
    let aHitbox = getHitbox(a);
    let bHitbox = getHitbox(b);

    // Check collision with adjusted hitboxes
    return aHitbox.x < bHitbox.x + bHitbox.width &&
        aHitbox.x + aHitbox.width > bHitbox.x &&
        aHitbox.y < bHitbox.y + bHitbox.height &&
        aHitbox.y + aHitbox.height > bHitbox.y;
}

// Helper function to get the actual hitbox of a sprite based on its type
function getHitbox(sprite) {
    let hitbox = {
        x: sprite.x,
        y: sprite.y,
        width: sprite.width,
        height: sprite.height
    };

    // Adjust hitbox based on sprite type
    if (sprite === pet) {
        // Pet's visible content is roughly from pixel 40 to 120 (80x80 in the middle)
        hitbox.x += 40;
        hitbox.y += 40;
        hitbox.width = 80;
        hitbox.height = 80;
    } else if (sprite.type === 'burger') {
        // Burger is roughly centered in its 80x80 canvas, about 60x60
        hitbox.x += 10;
        hitbox.y += 10;
        hitbox.width = 60;
        hitbox.height = 60;
    } else if (sprite.type === 'pizza') {
        // Pizza is roughly centered in its 80x80 canvas, about 60x60
        hitbox.x += 10;
        hitbox.y += 10;
        hitbox.width = 60;
        hitbox.height = 60;
    } else if (sprite.type === 'book' || sprite.type === 'clock') {
        // Book and clock are roughly centered in their 80x80 canvas, about 40x40
        hitbox.x += 20;
        hitbox.y += 20;
        hitbox.width = 40;
        hitbox.height = 40;
    }

    return hitbox;
}