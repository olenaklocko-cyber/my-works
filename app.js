// ===== Тренажер для мозку =====

// Питання
const defaultQuestions = [
    {
        id: 1,
        question: "🚪 Ви стоїте перед двома дверима. За одними — смерть, за іншими — вихід. Біля дверей стоять два охоронці: один завжди бреше, інший завжди каже правду. Ви можете задати одне питання одному охоронцю. Яке питання ви задасте?",
        options: [
            "Який охоронець скаже правду?",
            "Якщо я запитаю іншого охоронця, куди вести двері, що він відповість?",
            "Які двері ведуть до виходу?",
            "Який охоронець бреше?"
        ],
        correct: 1,
        category: "Логіка"
    },
    {
        id: 2,
        question: "🎲 Ви кидаєте два кубики. Яка ймовірність того, що сума очок буде більше 9?",
        options: ["1/6", "1/4", "5/36", "1/12"],
        correct: 2,
        category: "Математика"
    },
    {
        id: 3,
        question: "🧩 Яка цифра замість знака питання?\n1 → 1\n2 → 5\n3 → 14\n4 → 30\n5 → ?",
        options: ["55", "60", "65", "50"],
        correct: 0,
        category: "Послідовність"
    },
    {
        id: 4,
        question: "🏃 Чоловік дістався з точністю до хвилини в аеропорт за годину до відльоту літака. Він вирішив погуляти по терміналу. Коли він повернувся, то побачив, що літак вилетів. Чому?",
        options: [
            "Літак вилетів раніше",
            "Він переплутав час",
            "Він гуляв по іншому терміналу",
            "Він запізнився"
        ],
        correct: 2,
        category: "Загадка"
    },
    {
        id: 5,
        question: "⚖️ У вас є 9 кульок, однакових на вигляд, але одна важча за інші. Є ваги без гирь. Як знайти важчу кулю, зробивши мінімум зважувань?",
        options: [
            "Зважувати по одній",
            "Розділити на 3 групи по 3 і зважувати двічі",
            "Розділити на дві групи та порівняти",
            "Зважувати всі одночасно"
        ],
        correct: 1,
        category: "Логіка"
    }
];

// Стан
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
    if (tabId === 'quiz') {
        addSection.classList.remove('hidden');
    } else {
        addSection.classList.add('hidden');
    }

    if (tabId === 'quotes') {
        fetchQuote();
    }
}

// ===== ФОРМА ПИТАНЬ =====
function toggleQuestionForm() {
    const wrapper = document.getElementById('question-form-wrapper');
    const card = document.getElementById('add-question-card');
    wrapper.classList.toggle('hidden');
    if (!wrapper.classList.contains('hidden')) {
        card.style.display = 'none';
    } else {
        card.style.display = 'flex';
    }
}

// ===== КВІЗ =====
function updateTotalQuestions() {
    document.getElementById('total-questions').textContent = questions.length;
}

function loadCustomQuestions() {
    const saved = localStorage.getItem('bt_questions');
    if (saved) {
        customQuestions = JSON.parse(saved);
        questions = [...defaultQuestions, ...customQuestions];
        updateTotalQuestions();
    }
}

function saveCustomQuestions() {
    localStorage.setItem('bt_questions', JSON.stringify(customQuestions));
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    showScreen('question');
    renderQuestion();
}

function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(name + '-screen').classList.add('active');
}

function renderQuestion() {
    const q = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('question-number').textContent = `Питання ${currentQuestion + 1} з ${questions.length}`;
    document.getElementById('question-category').textContent = q.category;
    document.getElementById('question-text').textContent = q.question;

    document.getElementById('answers').innerHTML = q.options.map((opt, i) =>
        `<button class="answer-btn" onclick="selectAnswer(${i})">${opt}</button>`
    ).join('');

    document.getElementById('next-btn').classList.remove('show');
    answered = false;
}

function selectAnswer(index) {
    if (answered) return;
    answered = true;

    const correct = questions[currentQuestion].correct;
    document.querySelectorAll('.answer-btn').forEach((btn, i) => {
        btn.style.pointerEvents = 'none';
        if (i === correct) btn.classList.add('correct');
        else if (i === index) btn.classList.add('wrong');
    });

    if (index === correct) {
        score++;
    }

    setTimeout(() => {
        const btn = document.getElementById('next-btn');
        btn.classList.add('show');
        btn.textContent = currentQuestion === questions.length - 1 ? 'Показати результат' : 'Наступне питання →';
    }, 500);
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= questions.length) showResult();
    else renderQuestion();
}

function showResult() {
    showScreen('result');
    const pct = Math.round((score / questions.length) * 100);
    let icon, title, msg;

    if (pct === 100) { icon = '🏆'; title = 'Ідеально!'; msg = 'Ви відповіли правильно на все!'; }
    else if (pct >= 80) { icon = '🎉'; title = 'Чудово!'; msg = `${score} з ${questions.length} — відмінно!`; }
    else if (pct >= 60) { icon = '👍'; title = 'Непогано!'; msg = `${score} з ${questions.length} — продовжуйте!`; }
    else if (pct >= 40) { icon = '🤔'; title = 'Є над чим працювати'; msg = `${score} з ${questions.length}`; }
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

    const options = [o1, o2];
    if (o3) options.push(o3);
    if (o4) options.push(o4);

    customQuestions.push({ id: Date.now(), question: q, options, correct: 0, category: cat });
    questions = [...defaultQuestions, ...customQuestions];
    saveCustomQuestions();
    updateTotalQuestions();
    renderCustomQuestions();
    document.getElementById('add-question-form').reset();
    alert('Питання додано! 🎉');
}

function renderCustomQuestions() {
    const el = document.getElementById('custom-questions-list');
    if (!customQuestions.length) {
        el.innerHTML = '<p style="color:#666;font-size:14px;">Ще не додано</p>';
        return;
    }
    el.innerHTML = customQuestions.map((q, i) =>
        `<div class="custom-question-item">
            <span>${q.question.substring(0, 40)}${q.question.length > 40 ? '...' : ''}</span>
            <button class="delete-btn" onclick="deleteQuestion(${i})">Видалити</button>
        </div>`
    ).join('');
}

function deleteQuestion(i) {
    if (confirm('Видалити?')) {
        customQuestions.splice(i, 1);
        questions = [...defaultQuestions, ...customQuestions];
        saveCustomQuestions();
        updateTotalQuestions();
        renderCustomQuestions();
    }
}

// ===== СТІКЕРИ =====
function loadStickers() {
    const s = localStorage.getItem('bt_stickers');
    if (s) stickers = JSON.parse(s);
}

function saveStickers() {
    localStorage.setItem('bt_stickers', JSON.stringify(stickers));
}

function addSticker() {
    const input = document.getElementById('sticker-input');
    const text = input.value.trim();
    const color = document.getElementById('sticker-color').value;
    if (!text) { alert('Введіть текст!'); return; }

    stickers.push({ id: Date.now(), text, color });
    saveStickers();
    renderStickers();
    input.value = '';
}

function renderStickers() {
    const board = document.getElementById('stickers-board');
    const empty = document.getElementById('empty-board');

    if (!stickers.length) {
        board.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    board.innerHTML = stickers.map(s => {
        const dark = adjustColor(s.color, -40);
        return `<div class="sticker" style="background:linear-gradient(135deg,${s.color},${dark})" data-id="${s.id}">
            <div class="sticker-text">${escapeHtml(s.text)}</div>
            <div class="sticker-actions">
                <button class="sticker-btn sticker-btn-edit" onclick="editSticker(${s.id})" title="Редагувати">✏️</button>
                <button class="sticker-btn sticker-btn-delete" onclick="deleteSticker(${s.id})" title="Видалити">✕</button>
            </div>
        </div>`;
    }).join('');
}

function editSticker(id) {
    const s = stickers.find(x => x.id === id);
    if (!s) return;
    const el = document.querySelector(`.sticker[data-id="${id}"] .sticker-text`);
    const editable = el.contentEditable === 'true';

    if (editable) {
        el.contentEditable = 'false';
        s.text = el.textContent.trim();
        saveStickers();
    } else {
        el.contentEditable = 'true';
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

function deleteSticker(id) {
    if (confirm('Видалити стікер?')) {
        stickers = stickers.filter(s => s.id !== id);
        saveStickers();
        renderStickers();
    }
}

function escapeHtml(t) {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
}

function adjustColor(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (n >> 16) + amt));
    const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
    const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
    return '#' + ((b | (g << 8) | (r << 16)).toString(16).padStart(6, '0'));
}

// ===== ЦИТАТИ (УКРАЇНСЬКІ) =====

const ukrainianQuotes = [
    { quote: "Життя — це те, що з тобою трапляється, поки ти будуєш плани.", author: "Джон Леннон" },
    { quote: "Єдиний спосіб робити велику роботу — любити те, що ти робиш.", author: "Стів Джобс" },
    { quote: "Майбутнє належить тим, хто вірить у красу своєї мрії.", author: "Елеонора Рузвельт" },
    { quote: "Той, хто йде за натовпом, далеко не піде. Той, хто йде сам, може піти далеко.", author: "Невідомий" },
    { quote: "Знання — це єдина річ, яка зростає, коли її ділять.", author: "Арістотель" },
    { quote: "Найкращий час посадити дерево було 20 років тому. Другий найкращий час — зараз.", author: "Китайське прислів'я" },
    { quote: "Не бійся йти повільно, бійся стояти на місці.", author: "Китайське прислів'я" },
    { quote: "Мудрість приходить не з віком, а з освіти та досвіду.", author: "Аврелій Августин" },
    { quote: "Єдине обмеження — це твої сумніви.", author: "Брюс Лі" },
    { quote: "Кожен день — це нова можливість стати кращим.", author: "Невідомий" },
    { quote: "Той, хто шукає, той знаходить.", author: "Невідомий" },
    { quote: "Мрії стають реальністю, коли ми починаємо діяти.", author: "Невідомий" },
    { quote: "Успіх — це сума малих зусиль, що повторюються щодня.", author: "Роберт Кіолосакі" },
    { quote: "Не важливо, як повільно ти йдеш, поки ти не зупиняєшся.", author: "Конфуцій" },
    { quote: "Той, хто контролює свої думки, контролює своє життя.", author: "Невідомий" },
    { quote: "Щастя — це не готова річ. Його потрібно створювати.", author: "Бернард Шоу" },
    { quote: "Найбільша нагорода за працю — сама праця.", author: "Томас Едісон" },
    { quote: "Віра в себе — це перший крок до успіху.", author: "Невідомий" },
    { quote: "Коли одна двері зачиняються, відчиняються інші.", author: "Аліса Еліс" },
    { quote: "Людина стає багатшою, коли вона дає, а не бере.", author: "Біблія" },
    { quote: "Розумний чоловік вчиться на помилках інших, дурний — на своїх.", author: "Бісмарк" },
    { quote: "Терпіння — це ключ до успіху.", author: "Невідомий" },
    { quote: "Найкращий учень — той, хто навчається сам.", author: "Невідомий" },
    { quote: "Не шукай помилок у інших, шукай їх у собі.", author: "Невідомий" },
    { quote: "Краса — це не зовнішність, а внутрішній світ.", author: "Невідомий" },
    { quote: "Справжня сила — це вміння пробачити.", author: "Невідомий" },
    { quote: "Роби те, що любиш, і тобі ніколи не доведеться працювати.", author: "Конфуцій" },
    { quote: "Той, хто має мету, знайде шлях.", author: "Невідомий" },
    { quote: "Не порівнюй себе з іншими, порівнюй себе з тим, ким ти був учора.", author: "Невідомий" },
    { quote: "Мудрість починається з подиву.", author: "Сократ" },
    { quote: "Єдине, що ми знаємо — це те, що ми нічого не знаємо.", author: "Сократ" },
    { quote: "Пізнай себе — і ти пізнаєш всесвіт.", author: "Геракліт" },
    { quote: "Думки стають речами. Вибирай добрі думки.", author: "Невідомий" },
    { quote: "Любов — це найсильніша сила у всесвіті.", author: "Пабло Казальс" },
    { quote: "Дякуй за кожен день — і життя стане кращим.", author: "Невідомий" },
    { quote: "Кожна людина має в собі сонце.", author: "Ральф Вальдо Емерсон" },
    { quote: "Сміх продовжує життя.", author: "Невідомий" },
    { quote: "Найкращий друг — це той, хто каже правду.", author: "Невідомий" },
    { quote: "Терпіння та час роблять свою справу.", author: "Жан де Лафонтен" },
    { quote: "Маленькі кроки ведуть до великих змін.", author: "Невідомий" },
    { quote: "Той, хто шукає добро, знайде його.", author: "Невідомий" },
    { quote: "Не бійся помилятися — бійся не пробувати.", author: "Невідомий" },
    { quote: "Краса — це бачити світ очима дитини.", author: "Антуан де Сент-Екзюпері" },
    { quote: "Доброта змінює світ.", author: "Невідомий" },
    { quote: "Кожна краплина води має цінність.", author: "Невідомий" },
    { quote: "Сонце світить для всіх однаково.", author: "Невідомий" },
    { quote: "Найкраща подорож — це подорож до самого себе.", author: "Невідомий" },
    { quote: "Тиша — це мова, яку розуміють всі.", author: "Невідомий" },
    { quote: "Відчай — це початок нового шляху.", author: "Невідомий" }
];

async function fetchQuote() {
    document.getElementById('quotes-loading').classList.remove('hidden');
    document.getElementById('quotes-card').classList.add('hidden');
    document.getElementById('quotes-error').classList.add('hidden');

    // Беремо випадкову українську цитату
    const randomIndex = Math.floor(Math.random() * ukrainianQuotes.length);
    const randomQuote = ukrainianQuotes[randomIndex];

    // Імітуємо завантаження (щоб було красиво)
    setTimeout(() => {
        document.getElementById('quote-text').textContent = `"${randomQuote.quote}"`;
        document.getElementById('quote-author').textContent = `— ${randomQuote.author}`;

        document.getElementById('quotes-loading').classList.add('hidden');
        document.getElementById('quotes-card').classList.remove('hidden');
    }, 800);
}

// ===== ІНІЦІАЛІЗАЦІЯ =====
document.addEventListener('DOMContentLoaded', function() {
    updateTotalQuestions();
    loadCustomQuestions();
    renderCustomQuestions();
    loadStickers();
    renderStickers();

    document.getElementById('start-btn').addEventListener('click', startQuiz);
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('restart-btn').addEventListener('click', restartQuiz);
    document.getElementById('add-question-form').addEventListener('submit', addQuestion);

    document.getElementById('add-sticker-btn').addEventListener('click', addSticker);
    document.getElementById('sticker-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addSticker();
    });

    document.getElementById('new-quote-btn').addEventListener('click', fetchQuote);
    document.getElementById('retry-btn').addEventListener('click', fetchQuote);
});
