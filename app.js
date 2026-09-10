// ===== Тренажер для мозку =====

// Питання
const defaultQuestions = [
    { id: 1, question: "🚪 Ви стоїте перед двома дверима. За одними — смерть, за іншими — вихід. Біля дверей стоять два охоронці: один завжди бреше, інший завжди каже правду. Яке питання ви задасте?", options: ["Який охоронець скаже правду?", "Якщо я запитаю іншого охоронця, куди вести двері, що він відповість?", "Які двері ведуть до виходу?", "Який охоронець бреше?"], correct: 1, category: "Логіка" },
    { id: 2, question: "🎲 Ви кидаєте два кубики. Яка ймовірність того, що сума очок буде більше 9?", options: ["1/6", "1/4", "5/36", "1/12"], correct: 2, category: "Математика" },
    { id: 3, question: "🧩 Яка цифра замість знака питання?\n1 → 1\n2 → 5\n3 → 14\n4 → 30\n5 → ?", options: ["55", "60", "65", "50"], correct: 0, category: "Послідовність" },
    { id: 4, question: "🏃 Чоловік дістався в аеропорт за годину до відльоту. Він погуляв по терміналу. Коли повернувся — літак вилетів. Чому?", options: ["Літак вилетів раніше", "Він переплутав час", "Він гуляв по іншому терміналу", "Він запізнився"], correct: 2, category: "Загадка" },
    { id: 5, question: "⚖️ У вас є 9 кульок, одна важча. Ваги без гирь. Як знайти важчу за мінімум зважувань?", options: ["Зважувати по одній", "Розділити на 3 групи по 3 і зважувати двічі", "Розділити на дві групи", "Зважувати всі одночасно"], correct: 1, category: "Логіка" }
];

let questions = [...defaultQuestions];
let customQuestions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;
let stickers = [];

// ===== ТАБИ =====
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabId + '-tab').classList.add('active');
    const addSection = document.getElementById('add-question-section');
    if (tabId === 'quiz') addSection.classList.remove('hidden');
    else addSection.classList.add('hidden');
    if (tabId === 'quotes') fetchQuote();
    if (tabId === 'game') initGame();
}

// ===== КВІЗ =====
function updateTotalQuestions() { document.getElementById('total-questions').textContent = questions.length; }

function loadCustomQuestions() {
    const s = localStorage.getItem('bt_questions');
    if (s) { customQuestions = JSON.parse(s); questions = [...defaultQuestions, ...customQuestions]; updateTotalQuestions(); }
}

function saveCustomQuestions() { localStorage.setItem('bt_questions', JSON.stringify(customQuestions)); }

function startQuiz() { currentQuestion = 0; score = 0; answered = false; showScreen('question'); renderQuestion(); }

function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(name + '-screen').classList.add('active');
}

function renderQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('progress-fill').style.width = ((currentQuestion + 1) / questions.length * 100) + '%';
    document.getElementById('question-number').textContent = `Питання ${currentQuestion + 1} з ${questions.length}`;
    document.getElementById('question-category').textContent = q.category;
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('answers').innerHTML = q.options.map((o, i) =>
        `<button class="answer-btn" onclick="selectAnswer(${i})">${o}</button>`
    ).join('');
    document.getElementById('next-btn').classList.remove('show');
    answered = false;
}

function selectAnswer(i) {
    if (answered) return;
    answered = true;
    const c = questions[currentQuestion].correct;
    document.querySelectorAll('.answer-btn').forEach((b, idx) => {
        b.style.pointerEvents = 'none';
        if (idx === c) b.classList.add('correct');
        else if (idx === i) b.classList.add('wrong');
    });
    if (i === c) score++;
    setTimeout(() => {
        const btn = document.getElementById('next-btn');
        btn.classList.add('show');
        btn.textContent = currentQuestion === questions.length - 1 ? 'Показати результат' : 'Наступне питання →';
    }, 500);
}

function nextQuestion() { currentQuestion++; if (currentQuestion >= questions.length) showResult(); else renderQuestion(); }

function showResult() {
    showScreen('result');
    const p = Math.round((score / questions.length) * 100);
    let icon, title, msg;
    if (p === 100) { icon = '🏆'; title = 'Ідеально!'; msg = 'Ви відповіли правильно на все!'; }
    else if (p >= 80) { icon = '🎉'; title = 'Чудово!'; msg = `${score} з ${questions.length} — відмінно!`; }
    else if (p >= 60) { icon = '👍'; title = 'Непогано!'; msg = `${score} з ${questions.length} — продовжуйте!`; }
    else { icon = '💪'; title = 'Не здавайтесь!'; msg = `${score} з ${questions.length}`; }
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-score').textContent = `${score} з ${questions.length}`;
    document.getElementById('result-message').textContent = msg;
}

function restartQuiz() { showScreen('start'); }

function addQuestion(e) {
    e.preventDefault();
    const q = document.getElementById('new-question').value.trim();
    const o1 = document.getElementById('new-option1').value.trim();
    const o2 = document.getElementById('new-option2').value.trim();
    const o3 = document.getElementById('new-option3').value.trim();
    const o4 = document.getElementById('new-option4').value.trim();
    const cat = document.getElementById('new-category').value;
    if (!q) { alert('Введіть питання!'); return; }
    if (!o1) { alert('Введіть правильну відповідь!'); return; }
    if (!o2) { alert('Введіть неправильну відповідь!'); return; }
    const options = [o1, o2]; if (o3) options.push(o3); if (o4) options.push(o4);
    customQuestions.push({ id: Date.now(), question: q, options, correct: 0, category: cat });
    questions = [...defaultQuestions, ...customQuestions];
    saveCustomQuestions(); updateTotalQuestions(); renderCustomQuestions();
    document.getElementById('add-question-form').reset();
    alert('Питання додано! 🎉');
}

function renderCustomQuestions() {
    const el = document.getElementById('custom-questions-list');
    if (!customQuestions.length) { el.innerHTML = '<p style="color:#666;font-size:14px;">Ще не додано</p>'; return; }
    el.innerHTML = customQuestions.map((q, i) =>
        `<div class="custom-question-item"><span>${q.question.substring(0, 40)}${q.question.length > 40 ? '...' : ''}</span><button class="delete-btn" onclick="deleteQuestion(${i})">Видалити</button></div>`
    ).join('');
}

function deleteQuestion(i) {
    if (confirm('Видалити?')) { customQuestions.splice(i, 1); questions = [...defaultQuestions, ...customQuestions]; saveCustomQuestions(); updateTotalQuestions(); renderCustomQuestions(); }
}

function openQuestionForm() { document.getElementById('create-card').style.display = 'none'; document.getElementById('form-panel').classList.remove('hidden'); }
function closeQuestionForm() { document.getElementById('form-panel').classList.add('hidden'); document.getElementById('create-card').style.display = 'block'; document.getElementById('add-question-form').reset(); }

// ===== СТІКЕРИ =====
function loadStickers() { const s = localStorage.getItem('bt_stickers'); if (s) stickers = JSON.parse(s); }
function saveStickers() { localStorage.setItem('bt_stickers', JSON.stringify(stickers)); }

function addSticker() {
    const input = document.getElementById('sticker-input');
    const text = input.value.trim();
    const color = document.getElementById('sticker-color').value;
    if (!text) { alert('Введіть текст!'); return; }
    stickers.push({ id: Date.now(), text, color });
    saveStickers(); renderStickers(); input.value = '';
}

function renderStickers() {
    const board = document.getElementById('stickers-board');
    const empty = document.getElementById('empty-board');
    if (!stickers.length) { board.innerHTML = ''; empty.classList.remove('hidden'); return; }
    empty.classList.add('hidden');
    board.innerHTML = stickers.map(s => {
        const d = adjustColor(s.color, -40);
        return `<div class="sticker" style="background:linear-gradient(135deg,${s.color},${d})" data-id="${s.id}">
            <div class="sticker-text">${esc(s.text)}</div>
            <div class="sticker-actions">
                <button class="sticker-btn sticker-btn-edit" onclick="editSticker(${s.id})">✏️</button>
                <button class="sticker-btn sticker-btn-delete" onclick="deleteSticker(${s.id})">✕</button>
            </div></div>`;
    }).join('');
}

function editSticker(id) {
    const s = stickers.find(x => x.id === id); if (!s) return;
    const el = document.querySelector(`.sticker[data-id="${id}"] .sticker-text`);
    if (el.contentEditable === 'true') { el.contentEditable = 'false'; s.text = el.textContent.trim(); saveStickers(); }
    else { el.contentEditable = 'true'; el.focus(); const r = document.createRange(); r.selectNodeContents(el); window.getSelection().removeAllRanges(); window.getSelection().addRange(r); }
}

function deleteSticker(id) { if (confirm('Видалити?')) { stickers = stickers.filter(s => s.id !== id); saveStickers(); renderStickers(); } }

function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
function adjustColor(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (n >> 16) + amt));
    const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
    const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
    return '#' + ((b | (g << 8) | (r << 16)).toString(16).padStart(6, '0'));
}

// ===== ЦИТАТИ =====
const ukrainianQuotes = [
    { quote: "Життя — це те, що з тобою трапляється, поки ти будуєш плани.", author: "Джон Леннон" },
    { quote: "Єдиний спосіб робити велику роботу — любити те, що ти робиш.", author: "Стів Джобс" },
    { quote: "Майбутнє належить тим, хто вірить у красу своєї мрії.", author: "Елеонора Рузвельт" },
    { quote: "Не бійся йти повільно, бійся стояти на місці.", author: "Китайське прислів'я" },
    { quote: "Найкращий час посадити дерево було 20 років тому. Другий найкращий час — зараз.", author: "Китайське прислів'я" },
    { quote: "Мудрість приходить не з віком, а з освіти та досвіду.", author: "Аврелій Августин" },
    { quote: "Єдине обмеження — це твої сумніви.", author: "Брюс Лі" },
    { quote: "Мрії стають реальністю, коли ми починаємо діяти.", author: "Невідомий" },
    { quote: "Успіх — це сума малих зусиль, що повторюються щодня.", author: "Роберт Кіолосакі" },
    { quote: "Не важливо, як повільно ти йдеш, поки ти не зупиняєшся.", author: "Конфуцій" },
    { quote: "Щастя — це не готова річ. Його потрібно створювати.", author: "Бернард Шоу" },
    { quote: "Найбільша нагорода за працю — сама праця.", author: "Томас Едісон" },
    { quote: "Коли одна двері зачиняються, відчиняються інші.", author: "Аліса Еліс" },
    { quote: "Розумний чоловік вчиться на помилках інших, дурний — на своїх.", author: "Бісмарк" },
    { quote: "Пізнай себе — і ти пізнаєш всесвіт.", author: "Геракліт" },
    { quote: "Думки стають речами. Вибирай добрі думки.", author: "Невідомий" },
    { quote: "Любов — це найсильніша сила у всесвіті.", author: "Пабло Казальс" },
    { quote: "Кожна людина має в собі сонце.", author: "Ральф Вальдо Емерсон" },
    { quote: "Терпіння та час роблять свою справу.", author: "Жан де Лафонтен" },
    { quote: "Маленькі кроки ведуть до великих змін.", author: "Невідомий" }
];

async function fetchQuote() {
    document.getElementById('quotes-loading').classList.remove('hidden');
    document.getElementById('quotes-card').classList.add('hidden');
    document.getElementById('quotes-error').classList.add('hidden');
    const r = ukrainianQuotes[Math.floor(Math.random() * ukrainianQuotes.length)];
    setTimeout(() => {
        document.getElementById('quote-text').textContent = `"${r.quote}"`;
        document.getElementById('quote-author').textContent = `— ${r.author}`;
        document.getElementById('quotes-loading').classList.add('hidden');
        document.getElementById('quotes-card').classList.remove('hidden');
    }, 600);
}

// ===== ГРА: ПТАШКА (Flappy Bird Style) =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameRunning = false;
let gameStarted = false;
let gameAnimId = null;
let gameScore = 0;
let gameLives = 3;
let frameCount = 0;

// Пташка
let bird = { x: 80, y: 250, vy: 0, r: 18, wing: 0, wingDir: 1, startDelay: 0 };

// Гравітація та стрибок
const GRAVITY = 0.1;
const JUMP_FORCE = -3.2;
const JUMP_INTERVAL = 120;

// Зірочки що падають з пташки
const SPARKLES = [];

// Стовпчики (перешкоди)
const PIPES = [];
const PIPE_WIDTH = 55;
const PIPE_GAP = 200;
const PIPE_SPEED = 1.5;
const PIPE_SPAWN_INTERVAL = 150;

// Зірки на фоні
const STARS = [];
for (let i = 0; i < 50; i++) {
    STARS.push({ x: Math.random() * 400, y: Math.random() * 500, size: Math.random() * 2 + 0.5, speed: Math.random() * 0.5 + 0.2 });
}

function initGame() {
    if (gameAnimId) cancelAnimationFrame(gameAnimId);
    gameRunning = false;
    gameStarted = false;
    gameScore = 0;
    gameLives = 3;
    frameCount = 0;
    PIPES.length = 0;
    SPARKLES.length = 0;
    bird = { x: 80, y: 250, vy: 0, r: 18, wing: 0, wingDir: 1 };
    updateGameUI();
    drawFlappyFrame();
    document.getElementById('game-start-overlay').classList.remove('hidden');
    document.getElementById('game-over-overlay').classList.add('hidden');
    document.getElementById('game-win-overlay').classList.add('hidden');
}

function startGame() {
    document.getElementById('game-start-overlay').classList.add('hidden');
    document.getElementById('game-over-overlay').classList.add('hidden');
    gameRunning = true;
    gameStarted = true;
    bird = { x: 80, y: 250, vy: 0, r: 18, wing: 0, wingDir: 1, startDelay: 60 };
    PIPES.length = 0;
    SPARKLES.length = 0;
    gameScore = 0;
    gameLives = 3;
    frameCount = 0;
    updateGameUI();
    updateFlappy();
}

function jumpBird() {
    if (!gameRunning) return;
    bird.vy = JUMP_FORCE;
}

function drawBird(x, y, wingAngle) {
    ctx.save();
    ctx.translate(x, y);
    
    // Тіло
    const bodyGrad = ctx.createRadialGradient(-2, -2, 0, 0, 0, bird.r);
    bodyGrad.addColorStop(0, '#ffdd00');
    bodyGrad.addColorStop(0.6, '#ffaa00');
    bodyGrad.addColorStop(1, '#ff6600');
    ctx.fillStyle = bodyGrad;
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, bird.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Крило
    ctx.fillStyle = '#ff8800';
    ctx.beginPath();
    const wingY = Math.sin(wingAngle) * 8;
    ctx.ellipse(-5, wingY, 12, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Очко
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(7, -5, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(9, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Блиск в оці
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(10, -6, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Дзьоб
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(24, 2);
    ctx.lineTo(14, 6);
    ctx.closePath();
    ctx.fill();
    
    // Щічка
    ctx.fillStyle = 'rgba(255, 100, 100, 0.4)';
    ctx.beginPath();
    ctx.arc(5, 5, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function addSparkle(x, y) {
    for (let i = 0; i < 3; i++) {
        SPARKLES.push({
            x: x + Math.random() * 10 - 5,
            y: y - 10,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * -2 - 1,
            life: 1,
            size: Math.random() * 4 + 2,
            color: ['#ffdd00', '#ff00ff', '#00f5ff', '#ffffff'][Math.floor(Math.random() * 4)]
        });
    }
}

function updateSparkles() {
    for (let i = SPARKLES.length - 1; i >= 0; i--) {
        const s = SPARKLES[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05;
        s.life -= 0.02;
        if (s.life <= 0) SPARKLES.splice(i, 1);
    }
}

function drawSparkles() {
    SPARKLES.forEach(s => {
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        // Малюємо зірочку
        const spikes = 4;
        const outerR = s.size;
        const innerR = s.size * 0.4;
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const px = s.x + Math.cos(angle) * r;
            const py = s.y + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;
}

function drawFlappyFrame() {
    // Фон
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#0a0a2e');
    bgGrad.addColorStop(0.5, '#1a1a4e');
    bgGrad.addColorStop(1, '#0d0d2b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Зірки
    STARS.forEach(s => {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(frameCount * 0.02 + s.x) * 0.3})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Стовпчики
    PIPES.forEach(p => {
        // Верхній стовпчик
        const topGrad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_WIDTH, 0);
        topGrad.addColorStop(0, '#4a0faa');
        topGrad.addColorStop(1, '#7b2fff');
        ctx.fillStyle = topGrad;
        ctx.shadowColor = '#7b2fff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(p.x, 0, PIPE_WIDTH, p.gapY, 8);
        ctx.fill();

        // Нижній стовпчик
        const bottomY = p.gapY + PIPE_GAP;
        const bottomH = canvas.height - bottomY;
        const botGrad = ctx.createLinearGradient(p.x, bottomY, p.x + PIPE_WIDTH, bottomY);
        botGrad.addColorStop(0, '#4a0faa');
        botGrad.addColorStop(1, '#7b2fff');
        ctx.fillStyle = botGrad;
        ctx.beginPath();
        ctx.roundRect(p.x, bottomY, PIPE_WIDTH, bottomH, 8);
        ctx.fill();

        // Неонові краї
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(p.x, 0, PIPE_WIDTH, p.gapY, 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.roundRect(p.x, bottomY, PIPE_WIDTH, bottomH, 8);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Мітка проходу
        ctx.fillStyle = 'rgba(0, 245, 255, 0.08)';
        ctx.fillRect(p.x, p.gapY, PIPE_WIDTH, PIPE_GAP);
    });

    // Зірочки над пташкою
    drawSparkles();

    // Пташка
    bird.wing += 0.25 * bird.wingDir;
    if (bird.wing > 1 || bird.wing < -1) bird.wingDir *= -1;
    drawBird(bird.x, bird.y, bird.wing);

    // Підказка
    if (!gameStarted) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = 'bold 16px Nunito';
        ctx.textAlign = 'center';
        ctx.fillText('Натисни "СТАРТ" або Пробіл', canvas.width / 2, canvas.height - 40);
    }
}

function updateFlappy() {
    if (!gameRunning) return;

    frameCount++;

    // Рух пташки
    if (isJumping) {
        // Тримаємо — падаємо повільно
        bird.vy += GRAVITY * 0.3;
        bird.y += bird.vy;
    } else {
        // Відпустили — падаємо швидше
        bird.vy += GRAVITY;
        bird.y += bird.vy;
    }

    // Зірочки
    if (frameCount % 3 === 0) addSparkle(bird.x, bird.y);
    updateSparkles();

    // Зірки
    STARS.forEach(s => { s.x -= s.speed; if (s.x < 0) { s.x = canvas.width; s.y = Math.random() * canvas.height; } });

    // Нові стовпчики
    if (frameCount % PIPE_SPAWN_INTERVAL === 0) {
        const minGapY = 60;
        const maxGapY = canvas.height - PIPE_GAP - 60;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        PIPES.push({ x: canvas.width + 10, gapY: gapY, scored: false });
    }

    // Рух стовпчиків
    PIPES.forEach(p => { p.x -= PIPE_SPEED; });

    // Рахунок
    PIPES.forEach(p => {
        if (!p.scored && p.x + PIPE_WIDTH < bird.x) {
            p.scored = true;
            gameScore++;
            updateGameUI();
        }
    });

    // Видалення старих стовпчиків
    while (PIPES.length > 0 && PIPES[0].x + PIPE_WIDTH < -10) PIPES.shift();

    // Колізія зі стінами
    if (bird.y - bird.r <= 0 || bird.y + bird.r >= canvas.height) {
        gameOverBird();
        return;
    }

    // Колізія зі стовпчиками
    for (const p of PIPES) {
        const inX = bird.x + bird.r > p.x && bird.x - bird.r < p.x + PIPE_WIDTH;
        const hitTop = bird.y - bird.r < p.gapY;
        const hitBot = bird.y + bird.r > p.gapY + PIPE_GAP;
        if (inX && (hitTop || hitBot)) {
            gameOverBird();
            return;
        }
    }

    drawFlappyFrame();
    gameAnimId = requestAnimationFrame(updateFlappy);
}

function gameOverBird() {
    gameRunning = false;
    cancelAnimationFrame(gameAnimId);
    
    // Вибух зірочок
    for (let i = 0; i < 20; i++) {
        SPARKLES.push({
            x: bird.x,
            y: bird.y,
            vx: Math.random() * 6 - 3,
            vy: Math.random() * 6 - 3,
            life: 1,
            size: Math.random() * 6 + 3,
            color: ['#ff0000', '#ffaa00', '#ff00ff', '#ffffff'][Math.floor(Math.random() * 4)]
        });
    }
    
    // Анімація вибуху
    let explosionFrame = 0;
    function animateExplosion() {
        if (explosionFrame > 30) {
            document.getElementById('final-score').textContent = gameScore;
            document.getElementById('game-over-overlay').classList.remove('hidden');
            return;
        }
        drawFlappyFrame();
        updateSparkles();
        drawSparkles();
        explosionFrame++;
        requestAnimationFrame(animateExplosion);
    }
    animateExplosion();
}

function updateGameUI() {
    document.getElementById('game-score').textContent = gameScore;
    document.getElementById('game-lives').textContent = '❤️'.repeat(gameLives);
}

// Управління
let jumpInterval = null;
let isJumping = false;

function startJump() {
    if (!gameStarted) { startGame(); return; }
    if (!gameRunning) return;
    isJumping = true;
    bird.vy = JUMP_FORCE;
    clearInterval(jumpInterval);
    jumpInterval = setInterval(() => {
        if (isJumping && gameRunning) {
            bird.vy = JUMP_FORCE * 0.5;
        }
    }, 100);
}

function stopJump() {
    isJumping = false;
    clearInterval(jumpInterval);
}

// Клавіатура
document.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (!isJumping) startJump();
    }
});
document.addEventListener('keyup', e => {
    if (e.code === 'Space' || e.key === ' ') stopJump();
});

// Мишка та тач на Canvas
canvas.addEventListener('mousedown', e => { e.preventDefault(); startJump(); });
canvas.addEventListener('mouseup', stopJump);
canvas.addEventListener('mouseleave', stopJump);
canvas.addEventListener('touchstart', e => { e.preventDefault(); startJump(); });
canvas.addEventListener('touchend', stopJump);
canvas.addEventListener('touchcancel', stopJump);

// Кнопка стрибка
const btnJump = document.getElementById('btn-jump');
btnJump.addEventListener('mousedown', e => { e.preventDefault(); startJump(); });
btnJump.addEventListener('mouseup', stopJump);
btnJump.addEventListener('mouseleave', stopJump);
btnJump.addEventListener('touchstart', e => { e.preventDefault(); startJump(); });
btnJump.addEventListener('touchend', stopJump);
btnJump.addEventListener('touchcancel', stopJump);

// ===== ІНІЦІАЛІЗАЦІЯ =====
document.addEventListener('DOMContentLoaded', function() {
    updateTotalQuestions(); loadCustomQuestions(); renderCustomQuestions(); loadStickers(); renderStickers();
    document.getElementById('start-btn').addEventListener('click', startQuiz);
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('restart-btn').addEventListener('click', restartQuiz);
    document.getElementById('add-question-form').addEventListener('submit', addQuestion);
    document.getElementById('add-sticker-btn').addEventListener('click', addSticker);
    document.getElementById('sticker-input').addEventListener('keypress', e => { if (e.key === 'Enter') addSticker(); });
    document.getElementById('new-quote-btn').addEventListener('click', fetchQuote);
    document.getElementById('retry-btn').addEventListener('click', fetchQuote);
    document.getElementById('game-start-btn').addEventListener('click', startGame);
    document.getElementById('game-restart-btn').addEventListener('click', () => { initGame(); startGame(); });
    document.getElementById('game-win-restart-btn').addEventListener('click', () => { initGame(); startGame(); });
});
