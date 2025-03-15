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
let difficulty = 1; // Starting difficulty level
let maxDifficulty = 10; // Cap on difficulty to keep game playable
let difficultyIncreaseInterval = 20 * 60; // Increase difficulty every 20 seconds (faster progression)
let nextDifficultyIncrease = 0;
let foodValue = 15; // Increased base energy value from food
let stressorDamage = 8; // Reduced initial stressor damage

// Supabase configuration
const SUPABASE_URL = 'https://ckwvzlreewnairudjnrv.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrd3Z6bHJlZXduYWlydWRqbnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMTg0MjAsImV4cCI6MjA1NzU5NDQyMH0.t78lcbBeeWE14kIn6DoAoBTSMLt5QsIwNKocrZTyOkw'; // Replace with your Supabase anon key
let supabaseClient;

// Leaderboard variables
let leaderboardData = [];
let playerName = '';
let isSubmittingScore = false;
let currentPlayerEntry = null;
let leaderboardModal;
let closeLeaderboardBtn;
let playerNameInput;
let submitScoreBtn;
let nameErrorDiv;
let leaderboardBody;
let nameInputContainer;

// Fallback time functions in case p5.js doesn't provide them
function getCurrentHour() {
    return new Date().getHours();
}

function getCurrentMinute() {
    return new Date().getMinutes();
}

function getCurrentSecond() {
    return new Date().getSeconds();
}

function setup() {
    // Create canvas in the game-container
    let canvas = createCanvas(800, 600);
    canvas.parent('game-container');

    // Force canvas to absolute positioning within container
    let canvasElement = document.querySelector('canvas');
    canvasElement.style.position = 'absolute';
    canvasElement.style.top = '0';
    canvasElement.style.left = '0';
    canvasElement.style.zIndex = '10';
    canvasElement.style.display = 'block';

    // Force redraw on window resize
    window.addEventListener('resize', function () {
        redraw();
    });

    // Initialize Supabase client
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

    // Create share button with proper styling and positioning
    shareButton = createButton('Share on X');
    shareButton.parent('game-container'); // Put button inside the game container
    shareButton.position(width / 2 - 60, height / 2 + 180);
    shareButton.mousePressed(shareScore);
    shareButton.style('background-color', '#1DA1F2');
    shareButton.style('color', 'white');
    shareButton.style('border', 'none');
    shareButton.style('padding', '10px 15px');
    shareButton.style('border-radius', '20px');
    shareButton.style('font-weight', 'bold');
    shareButton.style('cursor', 'pointer');
    shareButton.style('z-index', '1000'); // Ensure button appears above canvas
    shareButton.style('position', 'absolute'); // Use absolute positioning
    shareButton.hide();

    // Load high score from local storage if available
    if (localStorage.getItem('pixelPetPanicHighScore')) {
        highScore = parseInt(localStorage.getItem('pixelPetPanicHighScore'));
    }

    // Set initial quote
    currentQuote = random(aiQuotes);

    // Initialize leaderboard elements
    initLeaderboard();

    // Fetch leaderboard data
    fetchLeaderboard();

    // Make sure game starts in correct state
    gameStarted = false;
    gameOver = false;

    // Add this to setup function to initialize the game state correctly
    additionalSetup();
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
    g.text("1st EDITION", 300, 85);
}

function drawPetSprite(g) {
    g.clear(); // Clear the graphics
    g.noStroke();

    // More appealing pet with rounded shape and gradient - making it cuter
    let mainColor = color(255, 120, 150); // More pink/cute color
    let highlightColor = color(255, 180, 200); // Lighter pink highlight

    // Draw body (circular with gradient)
    g.fill(mainColor);
    g.ellipse(80, 80, 120, 120);

    // Add gradient effect to body
    for (let r = 60; r > 0; r -= 10) {
        let gradientColor = lerpColor(mainColor, highlightColor, r / 60);
        g.fill(gradientColor);
        g.ellipse(80, 80, r * 2, r * 2);
    }

    // Highlight
    g.fill(highlightColor);
    g.ellipse(65, 65, 40, 40);

    // Eyes (larger, more expressive with shine) - make them bigger and cuter
    g.fill(255);
    g.ellipse(60, 65, 32, 36); // Moved up slightly and larger
    g.ellipse(100, 65, 32, 36);

    // Eye shine - bigger and more prominent
    g.fill(255, 255, 255, 230);
    g.ellipse(55, 60, 12, 12);
    g.ellipse(95, 60, 12, 12);

    // Pupils (that follow mouse for interactivity) - larger and cuter
    g.fill(0);
    let eyeX1 = constrain(mouseX / width * 10 - 5, -5, 5);
    let eyeY1 = constrain(mouseY / height * 10 - 5, -5, 5);
    g.ellipse(60 + eyeX1, 65 + eyeY1, 16, 20); // Moved up with eyes
    g.ellipse(100 + eyeX1, 65 + eyeY1, 16, 20);

    // Mouth (smile or different based on mood) - cuter expressions
    g.noFill();
    g.stroke(0);
    g.strokeWeight(3);
    if (pet && pet.mood === 'happy') {
        // Cuter happy mouth with rosy cheeks
        g.arc(80, 95, 50, 35, 0, PI);
        // Add teeth for happy mood
        g.fill(255);
        g.noStroke();
        g.rect(70, 95, 5, 5);
        g.rect(85, 95, 5, 5);
        g.stroke(0);
        g.noFill();

        // Rosy cheeks
        g.noStroke();
        g.fill(255, 150, 150, 150);
        g.ellipse(50, 85, 20, 15);
        g.ellipse(110, 85, 20, 15);
    } else if (pet && pet.mood === 'grumpy') {
        // Cuter grumpy expression
        g.arc(80, 105, 50, 25, PI, TWO_PI);
        // Add frown lines for grumpy mood
        g.line(55, 60, 65, 65);
        g.line(95, 65, 105, 60);

        // Add small tear for extra cuteness
        g.noStroke();
        g.fill(100, 200, 255, 200);
        g.ellipse(60, 85, 5, 8);
    } else {
        // Chaos mood - zigzag mouth with animation - make it cuter
        g.beginShape();
        for (let x = 55; x <= 105; x += 8) {
            let y = 95 + sin(frameCount * 0.1 + x * 0.5) * 8;
            g.vertex(x, y);
        }
        g.endShape();

        // Add spiral eyes for chaos mood
        g.noFill();
        g.stroke(0);
        g.strokeWeight(2);
        for (let r = 2; r < 10; r += 2) {
            g.ellipse(60, 65, r * 2, r * 2);
            g.ellipse(100, 65, r * 2, r * 2);
        }
    }

    // Add some personality features - cuter antenna
    g.noStroke();
    g.fill(255, 100, 150);
    // Heart-shaped antenna instead of circle
    g.ellipse(75, 45, 15, 15);
    g.ellipse(85, 45, 15, 15);
    g.triangle(70, 50, 80, 60, 90, 50);
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

    // Clock hands - using fixed angles for the sprite
    g.stroke(0);
    g.strokeWeight(3);

    // Hour hand - fixed at 10:10 (classic watch display position)
    let hourAngle = -PI / 6; // 10 o'clock
    g.line(40, 40, 40 + cos(hourAngle) * 15, 40 + sin(hourAngle) * 15);

    // Minute hand
    g.strokeWeight(2);
    let minuteAngle = PI / 6; // 2 o'clock
    g.line(40, 40, 40 + cos(minuteAngle) * 20, 40 + sin(minuteAngle) * 20);

    // Second hand
    g.stroke(255, 0, 0);
    g.strokeWeight(1);
    let secondAngle = PI / 2; // 6 o'clock
    g.line(40, 40, 40 + cos(secondAngle) * 25, 40 + sin(secondAngle) * 25);

    // Center dot
    g.fill(0);
    g.noStroke();
    g.ellipse(40, 40, 5, 5);
}

function draw() {
    // Skip game rendering if any overlay is open
    if (document.getElementById('nameInputOverlay') || document.getElementById('leaderboardOverlay')) {
        // Pause all p5.js processing while overlay is open
        return;
    }

    // Make sure the loop is running when no overlay is open
    if (!isLooping()) {
        loop();
    }

    // Clear the canvas each frame to prevent artifacts
    clear();

    // Draw the background every frame
    background(0, 0, 0, 0); // Transparent background

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

    // Handle share button visibility and positioning
    if (gameOver) {
        shareButton.show();
        shareButton.position(width / 2 - 60, height / 2 + 180);
    } else {
        shareButton.hide();
    }

    if (!gameStarted) {
        // Start screen
        image(gameTitle, 100, 100);

        // Animated pet with subtle bounce
        let bounceOffset = sin(frameCount * 0.05) * 5;
        image(petSprite, width / 2 - 80, 250 + bounceOffset);

        // Start button with glow effect
        for (let i = 3; i > 0; i--) {
            fill(50, 200, 100, 100 - i * 20);
            stroke(255, 150 - i * 30);
            strokeWeight(3 - i * 0.5);
            rect(width / 2 - 100 - i, 400 - i, 200 + i * 2, 60 + i * 2, 20);
        }

        // Main button
        fill(50, 200, 100);
        stroke(255);
        strokeWeight(3);
        rect(width / 2 - 100, 400, 200, 60, 20);

        // Button text with subtle pulse
        let startPulse = sin(frameCount * 0.1) * 2;
        fill(255);
        noStroke();
        textSize(30 + startPulse * 0.3);
        textAlign(CENTER, CENTER);
        text("START", width / 2, 430);

        // High score display
        textSize(20);
        text("High Score: " + highScore, width / 2, 480);

        // Leaderboard button
        fill(60, 100, 200);
        stroke(255);
        strokeWeight(2);
        rect(width / 2 - 100, 540, 200, 40, 15);

        fill(255);
        noStroke();
        textSize(18);
        text("View Leaderboard", width / 2, 560);

        // Instructions with better styling
        textSize(16);
        fill(255, 255, 255, 220);
        // Add text background for better readability
        noStroke();
        fill(0, 0, 0, 100);
        rect(width / 2 - 250, 510, 500, 30, 15);
        fill(255);
        text("Use UP/DOWN arrows to move. Collect food, avoid stressors!", width / 2, 525);

        // Check for start button click
        if (mouseIsPressed &&
            mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
            mouseY > 400 && mouseY < 460) {
            gameStarted = true;
            resetGame();
        }

        // Check for leaderboard button click
        if (mouseIsPressed &&
            mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
            mouseY > 540 && mouseY < 580) {
            showLeaderboard();
        }

        return;
    }

    if (gameOver) {
        // Game over screen with animation
        background(0, 0, 0, 150);

        // Particles
        updateParticles();

        // Create a semi-transparent panel for better text readability
        fill(0, 0, 0, 180);
        stroke(255, 100, 100);
        strokeWeight(2);
        rect(width / 2 - 250, height / 2 - 120, 500, 320, 20);

        // Game Over text with glow effect
        for (let i = 3; i > 0; i--) {
            fill(255, 0, 0, 200 - i * 40);
            textSize(60 + i * 2);
            textAlign(CENTER, CENTER);
            text("Game Over", width / 2, height / 2 - 80);
        }

        // Main text
        textSize(60);
        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        text("Game Over", width / 2, height / 2 - 80);

        // Score with glow
        for (let i = 2; i > 0; i--) {
            fill(255, 255, 255, 150 - i * 50);
            textSize(30 + i);
            text("Score: " + score, width / 2, height / 2 - 20);
        }

        textSize(30);
        fill(255);
        text("Score: " + score, width / 2, height / 2 - 20);

        // New high score with animation
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('pixelPetPanicHighScore', highScore);

            let hsGlow = sin(frameCount * 0.2) * 10;
            for (let i = 2; i > 0; i--) {
                fill(255, 255, 0, 150 - i * 30);
                textSize(25 + i + hsGlow * 0.1);
                text("NEW HIGH SCORE!", width / 2, height / 2 + 20);
            }

            textSize(25 + hsGlow * 0.1);
            fill(255, 255, 0);
            text("NEW HIGH SCORE!", width / 2, height / 2 + 20);
        } else {
            textSize(20);
            fill(200);
            text("High Score: " + highScore, width / 2, height / 2 + 20);
        }

        // Submit score button - adjusted width and position
        fill(50, 100, 200);
        stroke(255);
        strokeWeight(2);
        rect(width / 2 - 150, height / 2 + 50, 300, 50, 15);

        fill(255);
        noStroke();
        textSize(18); // Slightly smaller text size
        text("Submit Score to Leaderboard", width / 2, height / 2 + 75);

        // Restart button with glow effect - adjusted position
        for (let i = 3; i > 0; i--) {
            fill(50, 200, 100, 100 - i * 20);
            stroke(255, 150 - i * 30);
            strokeWeight(3 - i * 0.5);
            rect(width / 2 - 100 - i, height / 2 + 110 - i, 200 + i * 2, 50 + i * 2, 15);
        }

        // Main button
        fill(50, 200, 100);
        stroke(255);
        strokeWeight(3);
        rect(width / 2 - 100, height / 2 + 110, 200, 50, 15);

        // Button text
        fill(255);
        noStroke();
        textSize(25);
        textAlign(CENTER, CENTER);
        text("Play Again", width / 2, height / 2 + 135);

        // Show share button - adjusted position
        shareButton.show();
        shareButton.position(width / 2 - 60, height / 2 + 180);

        // Check for submit score button click - adjusted hitbox
        if (mouseIsPressed &&
            mouseX > width / 2 - 150 && mouseX < width / 2 + 150 &&
            mouseY > height / 2 + 50 && mouseY < height / 2 + 100) {
            showNameInput();
        }

        // Check for restart button click
        if (mouseIsPressed &&
            mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
            mouseY > height / 2 + 110 && mouseY < height / 2 + 160) {
            resetGame();
        }

        return;
    }

    // Pet movement
    let direction = 0;
    if (keyIsDown(UP_ARROW)) {
        direction = -1;  // Always move up with up arrow
    }
    else if (keyIsDown(DOWN_ARROW)) {
        direction = 1;  // Always move down with down arrow
    }

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

    // Difficulty management - increase difficulty over time but cap it
    if (frameCount >= nextDifficultyIncrease && difficulty < maxDifficulty) {
        difficulty += 0.5;
        difficulty = min(difficulty, maxDifficulty);
        nextDifficultyIncrease = frameCount + difficultyIncreaseInterval;

        // Create a more dramatic visual effect for difficulty increase
        for (let i = 0; i < 25; i++) {
            particles.push({
                x: width / 2,
                y: 20,
                vx: random(-3, 3),
                vy: random(0.5, 3),
                size: random(5, 15),
                color: color(255, 100, 0),
                text: difficulty === Math.floor(difficulty) ? "Level " + difficulty : "",
                life: 80
            });
        }

        // Add a screen flash effect on level up
        particles.push({
            x: width / 2,
            y: height / 2,
            vx: 0,
            vy: 0,
            size: width * 2,
            color: color(255, 100, 0, 50),
            life: 10
        });

        // Add a level up sound effect (visual cue)
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                particles.push({
                    x: random(width),
                    y: random(height),
                    vx: 0,
                    vy: 0,
                    size: random(5, 20),
                    color: color(255, 150, 0),
                    life: 20
                });
            }, i * 50);
        }
    }

    // Spawn items with more aggressive difficulty scaling
    let foodSpawnRate = 0.015 + (difficulty * 0.001); // Slower increase in food
    let stressorSpawnRate = 0.005 + (difficulty * 0.006); // Much faster increase in stressors

    // Ensure minimum food spawn rate to keep game playable
    foodSpawnRate = max(foodSpawnRate, 0.01);

    // Debug - force spawn items with more dramatic difficulty scaling
    if (frameCount % Math.floor(120 / (1 + difficulty * 0.15)) === 0) {
        foods.push({
            x: width,
            y: random(0, 500 - 80),
            width: 80,
            height: 80,
            type: random(['burger', 'pizza']),
            speed: 2 + (difficulty * 0.8) // More dramatic speed increase with difficulty
        });
    }

    if (frameCount % Math.floor(180 / (1 + difficulty * 0.25)) === 0) {
        stressors.push({
            x: width,
            y: random(0, 500 - 80),
            width: 80,
            height: 80,
            type: random(['book', 'clock']),
            speed: 2 + (difficulty * 1.2) // Even faster speed increase for stressors
        });
    }

    // Regular random spawning with more aggressive rates
    if (random() < foodSpawnRate) {
        foods.push({
            x: width,
            y: random(0, 500 - 80),
            width: 80,
            height: 80,
            type: random(['burger', 'pizza']),
            speed: 2 + (difficulty * 0.8) // More dramatic speed increase with difficulty
        });
    }

    if (random() < stressorSpawnRate) {
        stressors.push({
            x: width,
            y: random(0, 500 - 80),
            width: 80,
            height: 80,
            type: random(['book', 'clock']),
            speed: 2 + (difficulty * 1.2) // Even faster speed increase for stressors
        });
    }

    // Update particles
    updateParticles();

    // Draw pet with mood indicator
    drawPetSprite(petSprite); // Redraw to update expression based on mood
    image(petSprite, pet.x, pet.y);

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
            score += Math.ceil(difficulty); // Score increases with difficulty level

            // Calculate energy gain based on mood and difficulty
            let energyGain = foodValue;
            if (pet.mood === 'happy') {
                energyGain *= 1.5; // Happy pets get more energy from food
            } else if (pet.mood === 'grumpy') {
                energyGain *= 0.8; // Grumpy pets get less energy
            }

            // As difficulty increases, food gives significantly less energy
            energyGain *= (1 - (difficulty - 1) * 0.06); // Steeper decline
            energyGain = max(energyGain, 4); // Lower minimum energy gain at high levels

            energy = min(energy + energyGain, maxEnergy);
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
                text: "+" + Math.floor(energyGain),
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
            // Calculate energy loss based on mood and difficulty
            let energyLoss = stressorDamage;
            if (pet.mood === 'happy') {
                energyLoss *= 0.7; // Happy pets are more resilient to stressors
            } else if (pet.mood === 'grumpy') {
                energyLoss *= 1.2; // Grumpy pets are more affected by stressors
            }

            // As difficulty increases, stressors do significantly more damage
            energyLoss *= (1 + (difficulty - 1) * 0.12); // Steeper increase
            energyLoss = min(energyLoss, 25); // Higher maximum energy loss

            energy -= energyLoss;
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
                text: "-" + Math.floor(energyLoss),
                color: color(255, 50, 50),
                life: 60
            });

        } else if (s.x < -s.width) {
            stressors.splice(i, 1);
        }
    }

    // ===== REDESIGNED UI ELEMENTS =====
    // Create a unified UI panel at the top
    drawUIPanel();

    // Add passive energy drain at higher difficulty levels
    if (difficulty > 3) {
        // Passive energy drain increases with difficulty
        let passiveDrain = (difficulty - 3) * 0.01;
        energy -= passiveDrain;

        // Visual indicator of passive drain
        if (frameCount % 60 === 0) {
            particles.push({
                x: pet.x + pet.width / 2,
                y: pet.y + pet.height / 2,
                vx: 0,
                vy: -0.5,
                size: 15,
                text: "-" + passiveDrain.toFixed(2),
                color: color(255, 100, 100, 150),
                life: 40
            });
        }
    }

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

    // Display AI quote in speech bubble - AFTER all collision detection
    // This ensures the speech bubble is purely visual and doesn't affect gameplay
    if (!gameOver) {
        drawSpeechBubble(pet.x + pet.width, pet.y, currentQuote);
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
    push();

    // Outer container with gradient background
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';

    // Background gradient
    let bg1 = color(40, 45, 60);
    let bg2 = color(30, 35, 50);
    for (let i = 0; i < h; i++) {
        let inter = i / h;
        stroke(lerpColor(bg1, bg2, inter));
        line(x, y + i, x + w, y + i);
    }

    // Energy bar fill with dynamic gradient
    if (percent > 0) {
        // Create gradient colors based on energy level
        let c1, c2;
        if (percent > 0.6) {
            // High energy - green gradient
            c1 = color(50, 255, 100);
            c2 = color(100, 255, 150);
        } else if (percent > 0.3) {
            // Medium energy - yellow gradient
            c1 = color(255, 200, 50);
            c2 = color(255, 220, 100);
        } else {
            // Low energy - red gradient
            c1 = color(255, 50, 50);
            c2 = color(255, 100, 100);
        }

        // Draw gradient fill
        noStroke();
        for (let i = 0; i < w * percent; i++) {
            let inter = i / (w * percent);
            let c = lerpColor(c1, c2, inter);
            fill(c);
            rect(x + i, y, 1, h);
        }

        // Add shine effect
        let shine = sin(frameCount * 0.05) * 0.5 + 0.5;
        fill(255, 30 * shine);
        rect(x, y, w * percent, h / 2);

        // Add glowing particles for low energy warning
        if (percent < 0.3 && frameCount % 10 === 0) {
            particles.push({
                x: x + random(w * percent),
                y: y + random(h),
                vx: random(-0.5, 0.5),
                vy: random(-1, -0.5),
                size: random(2, 4),
                color: color(255, 100, 100, 150),
                life: 20
            });
        }
    }

    // Border with rounded corners
    noFill();
    stroke(100, 150, 200, 100);
    strokeWeight(1);
    rect(x, y, w, h, h / 2);

    // Add segment markers
    stroke(100, 150, 200, 50);
    strokeWeight(1);
    for (let i = 1; i < 5; i++) {
        let xPos = x + (w * 0.2 * i);
        line(xPos, y, xPos, y + h);
    }

    // Add percentage text with dynamic color and shadow
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);

    // Text shadow
    fill(0, 0, 0, 100);
    text(Math.floor(percent * 100) + "%", x + w / 2 + 1, y + h / 2 + 1);

    // Main text with color based on energy level
    if (percent > 0.6) {
        fill(220, 255, 220);
    } else if (percent > 0.3) {
        fill(255, 255, 200);
    } else {
        fill(255, 200, 200);
    }
    text(Math.floor(percent * 100) + "%", x + w / 2, y + h / 2);

    pop();
}

function drawSpeechBubble(x, y, message) {
    // Don't draw speech bubble if game is over
    if (gameOver) return;

    let bubbleWidth = 220;
    let bubbleHeight = 80;
    let bubbleX = x - bubbleWidth + 20;
    let bubbleY = y - 30;

    // Check if bubble would go off screen
    if (bubbleX < 10) bubbleX = 10;
    if (bubbleX + bubbleWidth > width - 10) bubbleX = width - bubbleWidth - 10;

    push(); // Save drawing state

    // Draw bubble shadow with smoother shadow
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
    fill(255, 255, 255, 180);
    noStroke();
    rect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 15);
    drawingContext.shadowBlur = 0;

    // Add subtle gradient overlay
    let c1 = color(255, 255, 255, 10);
    let c2 = color(200, 220, 255, 20);
    for (let y = 0; y < bubbleHeight; y++) {
        let inter = map(y, 0, bubbleHeight, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(bubbleX, bubbleY + y, bubbleX + bubbleWidth, bubbleY + y);
    }

    // Bubble border with smoother appearance
    stroke(100, 150, 200, 150);
    strokeWeight(1);
    noFill();
    rect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 15);

    // Draw pointer with improved style
    fill(255, 255, 255, 180);
    noStroke();
    beginShape();
    vertex(x, y);
    vertex(bubbleX + bubbleWidth - 30, bubbleY + bubbleHeight);
    vertex(bubbleX + bubbleWidth - 10, bubbleY + bubbleHeight - 10);
    endShape(CLOSE);

    // Pointer border
    stroke(100, 150, 200, 150);
    strokeWeight(1);
    noFill();
    beginShape();
    vertex(x, y);
    vertex(bubbleX + bubbleWidth - 30, bubbleY + bubbleHeight);
    vertex(bubbleX + bubbleWidth - 10, bubbleY + bubbleHeight - 10);
    endShape();

    // Draw text with improved styling and centered alignment
    fill(20, 30, 60);
    noStroke();
    textSize(14);
    textStyle(ITALIC);
    textAlign(CENTER, CENTER);

    // Break the message into lines that fit the bubble width
    let words = message.split(' ');
    let lines = [];
    let currentLine = '';
    let maxWidth = bubbleWidth - 30; // Padding for text

    for (let word of words) {
        let testLine = currentLine + word + ' ';
        let testWidth = textWidth(testLine);

        if (testWidth > maxWidth) {
            lines.push(currentLine);
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine); // Add the last line

    // Calculate total height of text
    let lineHeight = 16;
    let totalTextHeight = lines.length * lineHeight;

    // Ensure text fits in bubble
    if (totalTextHeight > bubbleHeight - 20) {
        lineHeight = (bubbleHeight - 20) / lines.length;
    }

    let startY = bubbleY + (bubbleHeight - totalTextHeight) / 2;

    // Draw each line centered
    for (let i = 0; i < lines.length; i++) {
        // Text shadow for better readability
        fill(0, 0, 0, 30);
        text(lines[i], bubbleX + bubbleWidth / 2 + 1, startY + i * lineHeight + 1);

        // Main text
        fill(20, 30, 60);
        text(lines[i], bubbleX + bubbleWidth / 2, startY + i * lineHeight);
    }

    pop(); // Restore drawing state
    textStyle(NORMAL);
    textAlign(LEFT);
}

function collision(obj1, obj2) {
    // More precise collision detection with a smaller hitbox
    // This creates a tighter collision area around the pet sprite
    const hitboxReduction = 15; // Reduce hitbox size by this many pixels on each side

    return (
        obj1.x + hitboxReduction < obj2.x + obj2.width - hitboxReduction &&
        obj1.x + obj1.width - hitboxReduction > obj2.x + hitboxReduction &&
        obj1.y + hitboxReduction < obj2.y + obj2.height - hitboxReduction &&
        obj1.y + obj1.height - hitboxReduction > obj2.y + hitboxReduction
    );
}

function resetGame() {
    // Reset game state variables
    energy = 100;
    score = 0;
    gameOver = false;
    foods = [];
    stressors = [];
    particles = [];
    gameStarted = true;
    difficulty = 4; // Start at level 4 instead of level 1
    nextDifficultyIncrease = frameCount + difficultyIncreaseInterval;
    foodValue = 15; // Reset food value to new higher base
    stressorDamage = 8; // Reset stressor damage to new lower base

    // Reset pet
    pet.x = 100;
    pet.y = 250;
    pet.mood = random(['happy', 'grumpy', 'chaos']);

    nextMoodChange = frameCount + moodChangeInterval;
    quoteTimer = frameCount + quoteInterval;
    currentQuote = random(aiQuotes);

    // Hide share button when game is reset
    shareButton.hide();

    // Ensure p5.js draw loop is running
    if (!isLooping()) {
        loop();
    }

    // Ensure canvas is visible and active
    let canvasElement = document.querySelector('canvas');
    if (canvasElement) {
        canvasElement.style.display = 'block';
        canvasElement.style.pointerEvents = 'auto';
    }

    console.log("Game reset. Game started: " + gameStarted + ", Game over: " + gameOver + ", Starting at difficulty: " + difficulty);
}

function shareScore() {
    let tweetText = `I scored ${score} points in Pixel Pet Panic: 1st Edition! Can you beat my score? #PixelPetPanic #AIGames`;
    let tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
}

function showLeaderboard() {
    // Stop the p5 loop
    noLoop();

    // Remove any existing overlays
    const existingOverlay = document.getElementById('leaderboardOverlay');
    if (existingOverlay) {
        document.body.removeChild(existingOverlay);
    }

    // Create an overlay div for the leaderboard
    const overlay = document.createElement('div');
    overlay.id = 'leaderboardOverlay';
    overlay.className = 'modal-overlay';

    // Create the leaderboard container
    const container = document.createElement('div');
    container.className = 'modal-content';
    container.style.width = '80%';
    container.style.maxWidth = '800px';
    container.style.maxHeight = '80vh';
    container.style.overflowY = 'auto';
    container.style.border = '2px solid rgba(100, 150, 255, 0.5)';

    // Header with title and close button
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '20px';
    header.style.paddingBottom = '10px';
    header.style.borderBottom = '2px solid rgba(255, 255, 255, 0.2)';

    const title = document.createElement('h2');
    title.textContent = '🏆 Pixel Pet Panic Leaderboard 🏆';
    title.className = 'modal-title';

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '28px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.transition = 'transform 0.2s';
    closeButton.style.width = '40px';
    closeButton.style.height = '40px';
    closeButton.style.borderRadius = '50%';
    closeButton.style.display = 'flex';
    closeButton.style.justifyContent = 'center';
    closeButton.style.alignItems = 'center';
    closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';

    // Hover effect for close button
    closeButton.onmouseover = function () {
        this.style.backgroundColor = 'rgba(255, 100, 100, 0.5)';
        this.style.transform = 'scale(1.1)';
    };
    closeButton.onmouseout = function () {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        this.style.transform = 'scale(1)';
    };

    header.appendChild(title);
    header.appendChild(closeButton);

    // Create table
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '10px';
    table.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    table.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    table.style.borderRadius = '8px';
    table.style.overflow = 'hidden';

    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

    const headers = ['Rank', 'Player', 'Score', 'Level', 'Date'];
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.padding = '12px 15px';
        th.style.textAlign = 'left';
        th.style.color = '#80c0ff';
        th.style.fontWeight = 'bold';
        th.style.borderBottom = '2px solid rgba(100, 150, 255, 0.5)';
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');
    tbody.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';

    // Loading indicator initially
    const loadingRow = document.createElement('tr');
    const loadingCell = document.createElement('td');
    loadingCell.colSpan = 5;
    loadingCell.textContent = 'Loading leaderboard data...';
    loadingCell.style.textAlign = 'center';
    loadingCell.style.padding = '30px';
    loadingCell.style.color = '#aaccff';

    loadingRow.appendChild(loadingCell);
    tbody.appendChild(loadingRow);

    table.appendChild(tbody);

    // Add elements to container
    container.appendChild(header);
    container.appendChild(table);

    // Add container to overlay
    overlay.appendChild(container);

    // Add to body
    document.body.appendChild(overlay);

    // Close button event
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        loop(); // Resume the game
    });

    // Fetch data
    fetchLeaderboardData(tbody);
}

function showNameInput() {
    // Stop the p5 loop completely and remove any existing event listeners
    noLoop();

    // Remove any existing overlays first
    const existingOverlay = document.getElementById('nameInputOverlay');
    if (existingOverlay) {
        document.body.removeChild(existingOverlay);
    }

    // Create a form element instead of a div for better keyboard handling
    const form = document.createElement('form');
    form.id = 'nameInputOverlay';
    form.className = 'modal-overlay';

    // Prevent form submission which would reload the page
    form.onsubmit = function (e) {
        e.preventDefault();
        return false;
    };

    // Create a form container
    const formContainer = document.createElement('div');
    formContainer.className = 'modal-content';
    formContainer.style.width = '80%';
    formContainer.style.maxWidth = '500px';
    formContainer.style.textAlign = 'center';
    formContainer.style.animation = 'fadeIn 0.3s ease-out';

    // Add CSS animation if not already defined
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    // Add title
    const title = document.createElement('h2');
    title.textContent = '🏆 Submit Your Score 🏆';
    title.className = 'modal-title';

    // Add score display
    const scoreDisplay = document.createElement('div');
    scoreDisplay.textContent = `Score: ${score}`;
    scoreDisplay.style.fontSize = '28px';
    scoreDisplay.style.color = 'white';
    scoreDisplay.style.marginBottom = '25px';
    scoreDisplay.style.fontWeight = 'bold';
    scoreDisplay.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
    scoreDisplay.style.animation = 'pulse 2s infinite';

    // Create an input element
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'playerNameInput';
    input.name = 'playerName';
    input.placeholder = 'Enter your name';
    input.maxLength = 20;
    input.autocomplete = 'off';
    input.className = 'name-input';
    input.style.width = '80%';
    input.style.marginBottom = '20px';

    // Error message container
    const errorMsg = document.createElement('div');
    errorMsg.id = 'nameError';
    errorMsg.style.color = '#ff5555';
    errorMsg.style.marginBottom = '20px';
    errorMsg.style.minHeight = '20px';
    errorMsg.style.fontSize = '16px';
    errorMsg.style.fontWeight = 'bold';

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.gap = '15px';
    buttonContainer.style.marginTop = '10px';

    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.textContent = 'Submit Score';
    submitBtn.className = 'submit-button';

    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'submit-button';
    cancelBtn.style.backgroundColor = '#555';

    // Button hover effects 
    submitBtn.onmouseover = function () {
        this.style.backgroundColor = '#60a0ff';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
    };
    submitBtn.onmouseout = function () {
        this.style.backgroundColor = '#4080ff';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    };

    cancelBtn.onmouseover = function () {
        this.style.backgroundColor = '#777';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
    };
    cancelBtn.onmouseout = function () {
        this.style.backgroundColor = '#555';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    };

    // Append all elements
    buttonContainer.appendChild(submitBtn);
    buttonContainer.appendChild(cancelBtn);

    formContainer.appendChild(title);
    formContainer.appendChild(scoreDisplay);
    formContainer.appendChild(input);
    formContainer.appendChild(errorMsg);
    formContainer.appendChild(buttonContainer);

    form.appendChild(formContainer);

    // Add to body
    document.body.appendChild(form);

    // Focus on input after a small delay
    setTimeout(() => {
        input.focus();

        // For mobile devices, try to force keyboard to show
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            input.click();
        }

        console.log('Input field focused');
    }, 100);

    // Submit function
    const submitScore = async () => {
        const name = input.value.trim();
        if (!name) {
            errorMsg.textContent = 'Please enter your name';
            errorMsg.style.animation = 'pulse 0.5s';
            setTimeout(() => { errorMsg.style.animation = ''; }, 500);
            return;
        }

        if (name.length < 2) {
            errorMsg.textContent = 'Name must be at least 2 characters';
            errorMsg.style.animation = 'pulse 0.5s';
            setTimeout(() => { errorMsg.style.animation = ''; }, 500);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        submitBtn.style.backgroundColor = '#2060cc';
        submitBtn.style.cursor = 'wait';

        try {
            // Insert score into Supabase
            const { data, error } = await supabaseClient
                .from('leaderboard')
                .insert([
                    {
                        player_name: name,
                        score: score,
                        difficulty_reached: Math.floor(difficulty)
                    }
                ])
                .select();

            if (error) throw error;

            // Store the current player's entry
            currentPlayerEntry = data[0];

            // Clean up overlay
            document.body.removeChild(form);

            // Show leaderboard
            showLeaderboard();

        } catch (error) {
            console.error('Error submitting score:', error);
            errorMsg.textContent = 'Error submitting score. Please try again.';
            errorMsg.style.animation = 'pulse 0.5s';
            setTimeout(() => { errorMsg.style.animation = ''; }, 500);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Score';
            submitBtn.style.backgroundColor = '#4080ff';
            submitBtn.style.cursor = 'pointer';
        }
    };

    // Add event listeners
    submitBtn.addEventListener('click', () => {
        console.log('Submit button clicked');
        submitScore();
    });

    // Handle Enter key
    input.addEventListener('keydown', (event) => {
        console.log('Key pressed in input:', event.key);
        if (event.key === 'Enter') {
            event.preventDefault();
            submitScore();
        }
    });

    // Cancel button
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(form);
        loop(); // Resume the game
    });
}

// Add a function to check and refresh the game state
function checkGameState() {
    // If the game is in an inconsistent state, reset it
    if (!gameStarted && !gameOver) {
        // We're at the start screen, make sure elements are positioned correctly
        console.log("Starting screen state confirmed");
    } else if (gameStarted && gameOver) {
        // We're at the game over screen, make sure share button is visible
        shareButton.show();
        shareButton.position(width / 2 - 60, height / 2 + 180);
        console.log("Game over state confirmed");
    } else if (gameStarted && !gameOver) {
        // We're in active gameplay, hide share button
        shareButton.hide();
        console.log("Active gameplay state confirmed");
    } else {
        // This shouldn't happen - reset to a known state
        console.error("Inconsistent game state detected, resetting to start screen");
        gameStarted = false;
        gameOver = false;
        shareButton.hide();
    }
}

// Add this to setup function to initialize the game state correctly
function additionalSetup() {
    // This will be called at the end of setup
    checkGameState();

    // Force a redraw to ensure everything is visible
    redraw();

    // Add a window event listener to handle visibility changes (tab switching)
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            // When coming back to the tab, force a redraw and check game state
            redraw();
            checkGameState();
        }
    });
}

function initLeaderboard() {
    // This function initializes all leaderboard-related variables and elements
    console.log("Initializing leaderboard");

    // Reset leaderboard data
    leaderboardData = [];
    currentPlayerEntry = null;
}

function fetchLeaderboard() {
    // This just calls fetchLeaderboardData with no tbody parameter
    fetchLeaderboardData();
}

function fetchLeaderboardData(tbody) {
    console.log("Fetching leaderboard data...");

    // Safety check if Supabase client isn't initialized
    if (!supabaseClient) {
        console.error("Supabase client not initialized");
        if (tbody) {
            const errorRow = document.createElement('tr');
            const errorCell = document.createElement('td');
            errorCell.colSpan = 5;
            errorCell.textContent = 'Error: Could not connect to the leaderboard';
            errorCell.style.textAlign = 'center';
            errorCell.style.padding = '30px';
            errorCell.style.color = '#ff5555';

            errorRow.appendChild(errorCell);
            tbody.innerHTML = '';
            tbody.appendChild(errorRow);
        }
        return;
    }

    // Fetch data from Supabase
    supabaseClient
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(100)
        .then(({ data, error }) => {
            if (error) {
                console.error('Error fetching leaderboard:', error);
                if (tbody) {
                    const errorRow = document.createElement('tr');
                    const errorCell = document.createElement('td');
                    errorCell.colSpan = 5;
                    errorCell.textContent = 'Error loading leaderboard data';
                    errorCell.style.textAlign = 'center';
                    errorCell.style.padding = '30px';
                    errorCell.style.color = '#ff5555';

                    errorRow.appendChild(errorCell);
                    tbody.innerHTML = '';
                    tbody.appendChild(errorRow);
                }
                return;
            }

            console.log("Leaderboard data received:", data);
            leaderboardData = data;

            // If we have a tbody element, populate the leaderboard table
            if (tbody) {
                populateLeaderboardTable(tbody, data);
            }
        });
}

function populateLeaderboardTable(tbody, data) {
    // Clear existing content
    tbody.innerHTML = '';

    // Check if data is empty
    if (!data || data.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 5;
        emptyCell.textContent = 'No scores recorded yet. Be the first!';
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '30px';
        emptyCell.style.color = '#aaccff';

        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
        return;
    }

    // Add each row from the data
    data.forEach((entry, index) => {
        const row = document.createElement('tr');

        // Highlight the current player's entry
        if (currentPlayerEntry && entry.id === currentPlayerEntry.id) {
            row.style.backgroundColor = 'rgba(100, 255, 100, 0.2)';
            row.style.border = '1px solid rgba(100, 255, 100, 0.5)';
        } else {
            // Alternate row colors
            row.style.backgroundColor = index % 2 === 0 ? 'rgba(50, 50, 100, 0.2)' : 'rgba(0, 0, 0, 0.3)';
        }

        // Hover effect
        row.style.transition = 'background-color 0.2s';
        row.onmouseover = function () {
            this.style.backgroundColor = 'rgba(100, 150, 255, 0.3)';
        };
        row.onmouseout = function () {
            if (currentPlayerEntry && entry.id === currentPlayerEntry.id) {
                this.style.backgroundColor = 'rgba(100, 255, 100, 0.2)';
            } else {
                this.style.backgroundColor = index % 2 === 0 ? 'rgba(50, 50, 100, 0.2)' : 'rgba(0, 0, 0, 0.3)';
            }
        };

        // Add rank cell with medal for top 3
        const rankCell = document.createElement('td');
        rankCell.style.padding = '10px 15px';
        rankCell.style.fontWeight = 'bold';

        if (index === 0) {
            rankCell.innerHTML = '🥇 1';
            rankCell.style.color = 'gold';
        } else if (index === 1) {
            rankCell.innerHTML = '🥈 2';
            rankCell.style.color = 'silver';
        } else if (index === 2) {
            rankCell.innerHTML = '🥉 3';
            rankCell.style.color = '#cd7f32'; // Bronze
        } else {
            rankCell.textContent = (index + 1).toString();
        }

        // Add player name
        const nameCell = document.createElement('td');
        nameCell.textContent = entry.player_name;
        nameCell.style.padding = '10px 15px';
        nameCell.style.fontWeight = 'bold';

        // Add score with animation for high scores
        const scoreCell = document.createElement('td');
        scoreCell.textContent = entry.score.toString();
        scoreCell.style.padding = '10px 15px';
        if (index < 3) {
            scoreCell.style.fontWeight = 'bold';
            scoreCell.style.color = '#ffcc00';
        }

        // Add difficulty level
        const levelCell = document.createElement('td');
        levelCell.textContent = entry.difficulty_reached ? entry.difficulty_reached.toString() : '1';
        levelCell.style.padding = '10px 15px';

        // Format date
        const dateCell = document.createElement('td');
        const createdAt = entry.created_at ? new Date(entry.created_at) : new Date();
        dateCell.textContent = createdAt.toLocaleDateString() + ' ' + createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        dateCell.style.padding = '10px 15px';
        dateCell.style.fontSize = '0.9em';
        dateCell.style.color = '#aaaaaa';

        // Add cells to row
        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        row.appendChild(levelCell);
        row.appendChild(dateCell);

        // Add row to table
        tbody.appendChild(row);
    });
}

function updateParticles() {
    // Update and draw all particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        let alpha = map(p.life, 0, 60, 0, 255);

        if (p.text) {
            // Text particles
            textSize(p.size);
            fill(p.color._array[0], p.color._array[1], p.color._array[2], alpha);
            textAlign(CENTER, CENTER);
            text(p.text, p.x, p.y);
        } else {
            // Regular particles
            fill(p.color._array[0], p.color._array[1], p.color._array[2], alpha);
            noStroke();
            ellipse(p.x, p.y, p.size, p.size);
        }
    }
}

function drawUIPanel() {
    // Create a more modern panel with gradient and glow
    push();
    // Main panel background with subtle gradient
    let panelHeight = 60;
    let c1 = color(20, 30, 50, 230);
    let c2 = color(30, 40, 70, 230);
    for (let y = 0; y < panelHeight; y++) {
        let inter = map(y, 0, panelHeight, 0, 1);
        let c = lerpColor(c1, c2, inter);
        noStroke();
        fill(c);
        rect(0, y, width, 1);
    }

    // Add subtle border glow
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(100, 150, 255, 0.3)';
    stroke(60, 100, 200, 50);
    noFill();
    rect(0, 0, width, panelHeight);
    drawingContext.shadowBlur = 0;

    // Organize UI into sections with better spacing
    const sectionPadding = 30;
    const leftSection = sectionPadding;
    const centerSection = width / 2;
    const rightSection = width - sectionPadding;

    // Energy section with improved visuals
    textAlign(LEFT, CENTER);

    // Energy label with icon
    fill(200, 220, 255);
    textSize(16);
    textStyle(BOLD);
    text("⚡ ENERGY", leftSection, 20);
    textStyle(NORMAL);

    // Energy value with dynamic color
    let energyColor = lerpColor(
        color(255, 50, 50),
        color(50, 255, 100),
        energy / maxEnergy
    );
    fill(energyColor);
    textSize(20);
    text(Math.floor(energy) + "/" + maxEnergy, leftSection + 100, 20);

    // Improved energy bar
    const barWidth = 180;
    const energyPercent = constrain(energy / maxEnergy, 0, 1);
    drawEnergyBar(leftSection, 35, barWidth, 15, energyPercent);

    // Score section with enhanced visuals
    textAlign(CENTER, CENTER);

    // Score label
    fill(200, 220, 255);
    textSize(16);
    textStyle(BOLD);
    text("🎯 SCORE", centerSection, 20);

    // Score value with dynamic effects
    textSize(28);
    if (score > 0 && score % 100 === 0) {
        // Special effect for milestone scores
        drawingContext.shadowBlur = 10;
        drawingContext.shadowColor = 'rgba(255, 255, 0, 0.5)';
        fill(255, 255, 100);
        text(score, centerSection, 45);
        // Add sparkle effect
        if (frameCount % 5 === 0) {
            particles.push({
                x: centerSection + random(-30, 30),
                y: 45 + random(-10, 10),
                vx: random(-1, 1),
                vy: random(-1, 0),
                size: random(2, 4),
                color: color(255, 255, 100),
                life: 20
            });
        }
    } else {
        fill(255, 200, 50);
        text(score, centerSection, 45);
    }
    drawingContext.shadowBlur = 0;
    textStyle(NORMAL);

    // Level indicator with improved design
    fill(150, 200, 255);
    textSize(14);
    text("LEVEL " + Math.floor(difficulty), centerSection + 100, 20);

    // Enhanced level progress bar
    const levelProgress = difficulty % 1;
    const levelBarWidth = 60;
    const levelBarHeight = 4;

    // Progress bar background
    fill(40, 50, 80);
    rect(centerSection + 70, 30, levelBarWidth, levelBarHeight, 2);

    // Progress bar fill with gradient
    let progressColor1 = color(100, 150, 255);
    let progressColor2 = color(150, 200, 255);
    for (let i = 0; i < levelBarWidth * levelProgress; i++) {
        let inter = i / (levelBarWidth * levelProgress);
        stroke(lerpColor(progressColor1, progressColor2, inter));
        line(centerSection + 70 + i, 30, centerSection + 70 + i, 30 + levelBarHeight);
    }
    noStroke();

    // Mood section with dynamic effects
    textAlign(RIGHT, CENTER);

    // Mood label
    fill(200, 220, 255);
    textSize(16);
    textStyle(BOLD);
    text("MOOD", rightSection - 80, 20);

    // Mood indicator with enhanced visuals
    textSize(20);
    let moodX = rightSection - 20;
    let moodY = 45;

    if (pet.mood === 'happy') {
        fill(50, 255, 100);
        text("😊 HAPPY", moodX, moodY);
        // Add happy particles
        if (frameCount % 20 === 0) {
            particles.push({
                x: moodX - 50,
                y: moodY,
                vx: random(-0.5, 0.5),
                vy: random(-1, -0.5),
                size: random(3, 6),
                color: color(50, 255, 100, 150),
                life: 30
            });
        }
    } else if (pet.mood === 'grumpy') {
        fill(255, 100, 100);
        text("😠 GRUMPY", moodX, moodY);
        // Add grumpy effect
        if (frameCount % 30 === 0) {
            particles.push({
                x: moodX - 50,
                y: moodY,
                vx: random(-0.5, 0.5),
                vy: random(-0.5, 0.5),
                size: random(3, 6),
                color: color(255, 100, 100, 150),
                life: 20
            });
        }
    } else {
        // Chaos mood with special effects
        push();
        translate(moodX - 50, moodY);
        rotate(sin(frameCount * 0.05) * 0.1);
        fill(255, 255, 0);
        text("🌀 CHAOS", 0, 0);
        // Add chaos particles
        if (frameCount % 10 === 0) {
            particles.push({
                x: 0,
                y: 0,
                vx: random(-1, 1),
                vy: random(-1, 1),
                size: random(2, 5),
                color: color(255, 255, 0, 150),
                life: 15
            });
        }
        pop();
    }
    textStyle(NORMAL);
    pop();
}

function hideLeaderboard() {
    // Find and remove any leaderboard overlay
    const leaderboardOverlay = document.getElementById('leaderboardOverlay');
    if (leaderboardOverlay) {
        document.body.removeChild(leaderboardOverlay);
    }

    // Find and remove any name input overlay
    const nameInputOverlay = document.getElementById('nameInputOverlay');
    if (nameInputOverlay) {
        document.body.removeChild(nameInputOverlay);
    }

    // Re-enable canvas events
    let canvasElement = document.querySelector('canvas');
    if (canvasElement) {
        canvasElement.style.pointerEvents = 'auto';
    }

    // Resume the game loop
    loop();
}
