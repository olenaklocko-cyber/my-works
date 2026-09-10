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

// ===== ГРА: АРКАНОЇД =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameRunning = false;
let gameAnimId = null;
let gameScore = 0;
let gameLives = 3;
let ball, paddle, bricks, brickRows, brickCols;

const BALL_RADIUS = 8;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_W = 52;
const BRICK_H = 18;
const BRICK_PAD = 6;
const BRICK_TOP = 40;

const NEON_COLORS = ['#ff00ff', '#7b2fff', '#00f5ff', '#00ff88', '#ff6b6b', '#ffaa00', '#ffff00'];

let keys = { left: false, right: false };

function initGame() {
    if (gameAnimId) cancelAnimationFrame(gameAnimId);
    gameRunning = false;
    gameScore = 0;
    gameLives = 3;
    updateGameUI();
    resetBallPaddle();
    createBricks();
    drawGame();
    document.getElementById('game-start-overlay').classList.remove('hidden');
    document.getElementById('game-over-overlay').classList.add('hidden');
    document.getElementById('game-win-overlay').classList.add('hidden');
}

function resetBallPaddle() {
    paddle = { x: canvas.width / 2 - PADDLE_WIDTH / 2, y: canvas.height - 30, w: PADDLE_WIDTH, h: PADDLE_HEIGHT };
    ball = { x: canvas.width / 2, y: canvas.height - 45, dx: 3.5, dy: -3.5, r: BALL_RADIUS };
}

function createBricks() {
    bricks = [];
    const totalW = BRICK_COLS * (BRICK_W + BRICK_PAD) - BRICK_PAD;
    const offsetX = (canvas.width - totalW) / 2;
    for (let r = 0; r < BRICK_ROWS; r++) {
        bricks[r] = [];
        for (let c = 0; c < BRICK_COLS; c++) {
            bricks[r][c] = { x: offsetX + c * (BRICK_W + BRICK_PAD), y: BRICK_TOP + r * (BRICK_H + BRICK_PAD), alive: true, color: NEON_COLORS[r % NEON_COLORS.length] };
        }
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Фон
    ctx.fillStyle = 'rgba(10, 10, 30, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Сітка
    ctx.strokeStyle = 'rgba(123, 47, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for (let i = 0; i < canvas.height; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

    // Блоки
    for (let r = 0; r < BRICK_ROWS; r++) {
        for (let c = 0; c < BRICK_COLS; c++) {
            const b = bricks[r][c];
            if (!b.alive) continue;
            ctx.fillStyle = b.color;
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.roundRect(b.x, b.y, BRICK_W, BRICK_H, 4);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Платформа
    const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x + paddle.w, paddle.y);
    gradient.addColorStop(0, '#7b2fff');
    gradient.addColorStop(1, '#ff00ff');
    ctx.fillStyle = gradient;
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    // М'яч
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function updateGame() {
    if (!gameRunning) return;

    // Рух платформи
    if (keys.left && paddle.x > 0) paddle.x -= 7;
    if (keys.right && paddle.x + paddle.w < canvas.width) paddle.x += 7;

    // Рух м'яча
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Від стін
    if (ball.x - ball.r <= 0 || ball.x + ball.r >= canvas.width) ball.dx = -ball.dx;
    if (ball.y - ball.r <= 0) ball.dy = -ball.dy;

    // Від платформи
    if (ball.y + ball.r >= paddle.y &&
        ball.x >= paddle.x && ball.x <= paddle.x + paddle.w &&
        ball.dy > 0) {
        ball.dy = -ball.dy;
        const hit = (ball.x - paddle.x) / paddle.w;
        ball.dx = (hit - 0.5) * 7;
    }

    // Блоки
    for (let r = 0; r < BRICK_ROWS; r++) {
        for (let c = 0; c < BRICK_COLS; c++) {
            const b = bricks[r][c];
            if (!b.alive) continue;
            if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + BRICK_W &&
                ball.y + ball.r > b.y && ball.y - ball.r < b.y + BRICK_H) {
                b.alive = false;
                ball.dy = -ball.dy;
                gameScore += 10;
                updateGameUI();
            }
        }
    }

    // Програш
    if (ball.y - ball.r > canvas.height) {
        gameLives--;
        updateGameUI();
        if (gameLives <= 0) {
            gameOver();
            return;
        }
        resetBallPaddle();
    }

    // Перемога
    if (bricks.every(row => row.every(b => !b.alive))) {
        gameWin();
        return;
    }

    drawGame();
    gameAnimId = requestAnimationFrame(updateGame);
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(gameAnimId);
    document.getElementById('final-score').textContent = gameScore;
    document.getElementById('game-over-overlay').classList.remove('hidden');
}

function gameWin() {
    gameRunning = false;
    cancelAnimationFrame(gameAnimId);
    document.getElementById('win-score').textContent = gameScore;
    document.getElementById('game-win-overlay').classList.remove('hidden');
}

function updateGameUI() {
    document.getElementById('game-score').textContent = gameScore;
    document.getElementById('game-lives').textContent = '❤️'.repeat(gameLives);
}

function startGame() {
    document.getElementById('game-start-overlay').classList.add('hidden');
    document.getElementById('game-over-overlay').classList.add('hidden');
    document.getElementById('game-win-overlay').classList.add('hidden');
    gameRunning = true;
    updateGame();
}

// Клавіатура
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
});
document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
});

// Мишка
canvas.addEventListener('mousemove', e => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    paddle.x = (e.clientX - rect.left) * scaleX - paddle.w / 2;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
});

// Мобільні кнопки
document.getElementById('btn-left').addEventListener('touchstart', e => { e.preventDefault(); keys.left = true; });
document.getElementById('btn-left').addEventListener('touchend', () => keys.left = false);
document.getElementById('btn-right').addEventListener('touchstart', e => { e.preventDefault(); keys.right = true; });
document.getElementById('btn-right').addEventListener('touchend', () => keys.right = false);
document.getElementById('btn-left').addEventListener('mousedown', () => keys.left = true);
document.getElementById('btn-left').addEventListener('mouseup', () => keys.left = false);
document.getElementById('btn-left').addEventListener('mouseleave', () => keys.left = false);
document.getElementById('btn-right').addEventListener('mousedown', () => keys.right = true);
document.getElementById('btn-right').addEventListener('mouseup', () => keys.right = false);
document.getElementById('btn-right').addEventListener('mouseleave', () => keys.right = false);

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
