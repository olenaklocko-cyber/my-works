// ===== Тренажер для мозку: Логіка та IQ =====

// Базові питання (для дорослих)
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
        category: "Логіка",
        hint: "Подумай про те, що тобі скаже брехун про правдивого і навпаки"
    },
    {
        id: 2,
        question: "🎲 Ви кидаєте два кубики. Яка ймовірність того, що сума очок буде більше 9?",
        options: [
            "1/6",
            "1/4",
            "5/36",
            "1/12"
        ],
        correct: 3,
        category: "Математика",
        hint: "Порахуй комбінації: (4,6), (5,5), (5,6), (6,4), (6,5), (6,6)"
    },
    {
        id: 3,
        question: "🧩 Яка цифра замість знака питання?\n1 → 1\n2 → 5\n3 → 14\n4 → 30\n5 → ?",
        options: [
            "55",
            "60",
            "65",
            "50"
        ],
        correct: 0,
        category: "Послідовність",
        hint: "Різниця між числами зростає: +4, +9, +16, +25 — це квадрати чисел"
    },
    {
        id: 4,
        question: "🏃 Чоловік дістався з точністю до хвилини в аеропорт за годину до відльоту літака. Він вирішив погуляти по терміналу. Коли він повернувся до виходу, то побачив, що літак вилетів. Чому?",
        options: [
            "Літак вилетів раніше",
            "Він переплутав час",
            "Він гуляв по іншому терміналу",
            "Літак вилетів вчасно, але він це не помітив"
        ],
        correct: 2,
        category: "Загадка",
        hint: "Подумай про те, скільки терміналів в аеропорту"
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
        category: "Логіка",
        hint: "Розділи на 3 групи по 3 кулі"
    }
];

// Стан додатку
let questions = [...defaultQuestions];
let customQuestions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;

// Стікери
let stickers = [];

// DOM елементи
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const addForm = document.getElementById('add-question-form');

// Ініціалізація
document.addEventListener('DOMContentLoaded', function() {
    // Завантажуємо дані
    updateTotalQuestions();
    loadCustomQuestions();
    renderCustomQuestions();
    loadStickers();
    renderStickers();
    
    // Обробники подій для квізу
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    addForm.addEventListener('submit', addQuestion);
    
    // Обробники подій для табів
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });
    
    // Обробник для додавання стікерів
    document.getElementById('add-sticker-btn').addEventListener('click', addSticker);
    document.getElementById('sticker-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addSticker();
    });
});

// ===== ТАБИ НАВІГАЦІЇ =====
function switchTab(e) {
    const tabId = e.target.dataset.tab;
    
    // Оновлюємо кнопки табів
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Оновлюємо контент табів
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('tab-' + tabId).classList.add('active');
    
    // Показуємо/ховаємо форму додавання питань
    const addQuestionSection = document.getElementById('add-question-section');
    if (tabId === 'quiz') {
        addQuestionSection.classList.remove('hidden');
    } else {
        addQuestionSection.classList.add('hidden');
    }
    
    // Завантажуємо загадку при відкритті вкладки
    if (tabId === 'riddle') {
        fetchRiddle();
    }
}

// ===== КВІЗ-ТРЕНЕЖЕР =====
function updateTotalQuestions() {
    document.getElementById('total-questions').textContent = questions.length;
}

function loadCustomQuestions() {
    const saved = localStorage.getItem('brainTrainer_questions');
    if (saved) {
        customQuestions = JSON.parse(saved);
        questions = [...defaultQuestions, ...customQuestions];
        updateTotalQuestions();
    }
}

function saveCustomQuestions() {
    localStorage.setItem('brainTrainer_questions', JSON.stringify(customQuestions));
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    
    showScreen('question');
    renderQuestion();
}

function showScreen(screen) {
    startScreen.classList.remove('active');
    questionScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    
    if (screen === 'start') startScreen.classList.add('active');
    if (screen === 'question') questionScreen.classList.add('active');
    if (screen === 'result') resultScreen.classList.add('active');
}

function renderQuestion() {
    const q = questions[currentQuestion];
    
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    
    document.getElementById('question-number').textContent = 
        `Питання ${currentQuestion + 1} з ${questions.length}`;
    document.getElementById('question-category').textContent = q.category;
    
    document.getElementById('question-text').textContent = q.question;
    
    const answersHtml = q.options.map((option, index) => 
        `<button class="answer-btn" data-index="${index}">${option}</button>`
    ).join('');
    document.getElementById('answers').innerHTML = answersHtml;
    
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', selectAnswer);
    });
    
    nextBtn.classList.remove('show');
    answered = false;
}

function selectAnswer(e) {
    if (answered) return;
    answered = true;
    
    const selectedIndex = parseInt(e.target.dataset.index);
    const correctIndex = questions[currentQuestion].correct;
    
    document.querySelectorAll('.answer-btn').forEach((btn, index) => {
        btn.style.pointerEvents = 'none';
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && selectedIndex !== correctIndex) {
            btn.classList.add('wrong');
        }
    });
    
    if (selectedIndex === correctIndex) {
        score++;
    } else {
        // Показуємо підказку при неправильній відповіді
        const hint = questions[currentQuestion].hint;
        if (hint) {
            const hintEl = document.createElement('div');
            hintEl.className = 'hint-box';
            hintEl.innerHTML = `💡 <strong>Підказка:</strong> ${hint}`;
            document.getElementById('answers').appendChild(hintEl);
        }
    }
    
    setTimeout(() => {
        nextBtn.classList.add('show');
        nextBtn.textContent = currentQuestion === questions.length - 1 
            ? 'Показати результат' 
            : 'Наступне питання →';
    }, 500);
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion >= questions.length) {
        showResult();
    } else {
        renderQuestion();
    }
}

function showResult() {
    showScreen('result');
    
    const percentage = Math.round((score / questions.length) * 100);
    
    let icon, title, message;
    
    if (percentage === 100) {
        icon = '🏆';
        title = 'Ідеально!';
        message = `Ви відповіли правильно на всі ${questions.length} питань! Ви — геній!`;
    } else if (percentage >= 80) {
        icon = '🎉';
        title = 'Чудово!';
        message = `Ви розім'яли мізки на ${score} з ${questions.length} балів!`;
    } else if (percentage >= 60) {
        icon = '👍';
        title = 'Непогано!';
        message = `Ви відповіли правильно на ${score} з ${questions.length}. Продовжуйте тренуватися!`;
    } else if (percentage >= 40) {
        icon = '🤔';
        title = 'Є над чим працювати';
        message = `${score} з ${questions.length}. Спробуйте ще раз!`;
    } else {
        icon = '💪';
        title = 'Не здавайтесь!';
        message = `${score} з ${questions.length}. Кожне тренування — це крок вперед!`;
    }
    
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-score').textContent = `${score} з ${questions.length}`;
    document.getElementById('result-message').textContent = message;
}

function restartQuiz() {
    showScreen('start');
}

function addQuestion(e) {
    e.preventDefault();
    
    const questionText = document.getElementById('new-question').value.trim();
    const category = document.getElementById('new-category').value;
    const option1 = document.getElementById('new-option1').value.trim();
    const option2 = document.getElementById('new-option2').value.trim();
    const option3 = document.getElementById('new-option3').value.trim();
    const option4 = document.getElementById('new-option4').value.trim();
    
    if (!questionText) {
        alert('Будь ласка, введіть текст питання!');
        document.getElementById('new-question').focus();
        return;
    }
    
    if (!option1) {
        alert('Будь ласка, введіть правильну відповідь!');
        document.getElementById('new-option1').focus();
        return;
    }
    
    if (!option2) {
        alert('Будь ласка, введіть хоча б один неправильний варіант!');
        document.getElementById('new-option2').focus();
        return;
    }
    
    const options = [option1];
    if (option2) options.push(option2);
    if (option3) options.push(option3);
    if (option4) options.push(option4);
    
    const newQuestion = {
        id: Date.now(),
        question: questionText,
        options: options,
        correct: 0,
        category: category
    };
    
    customQuestions.push(newQuestion);
    questions = [...defaultQuestions, ...customQuestions];
    
    saveCustomQuestions();
    updateTotalQuestions();
    renderCustomQuestions();
    
    addForm.reset();
    
    alert('Питання додано! 🎉');
}

function renderCustomQuestions() {
    const container = document.getElementById('custom-questions-list');
    
    if (customQuestions.length === 0) {
        container.innerHTML = '<p style="color: #666; font-size: 14px;">Ще не додано жодного питання</p>';
        return;
    }
    
    container.innerHTML = customQuestions.map((q, index) => `
        <div class="custom-question-item">
            <span>${q.question.substring(0, 40)}${q.question.length > 40 ? '...' : ''}</span>
            <button class="delete-btn" data-index="${index}">Видалити</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteQuestion);
    });
}

function deleteQuestion(e) {
    const index = parseInt(e.target.dataset.index);
    
    if (confirm('Видалити це питання?')) {
        customQuestions.splice(index, 1);
        questions = [...defaultQuestions, ...customQuestions];
        
        saveCustomQuestions();
        updateTotalQuestions();
        renderCustomQuestions();
    }
}

// ===== ЩОДЕННИК ДОЯГНЕНЬ (СТІКЕРИ) =====

// Завантажити стікери з localStorage
function loadStickers() {
    const saved = localStorage.getItem('brainTrainer_stickers');
    if (saved) {
        stickers = JSON.parse(saved);
    }
}

// Зберегти стікери в localStorage
function saveStickers() {
    localStorage.setItem('brainTrainer_stickers', JSON.stringify(stickers));
}

// Додати стікер
function addSticker() {
    const input = document.getElementById('sticker-input');
    const colorSelect = document.getElementById('sticker-color');
    const text = input.value.trim();
    const color = colorSelect.value;
    
    if (!text) {
        alert('Будь ласка, введіть текст стікера!');
        input.focus();
        return;
    }
    
    const sticker = {
        id: Date.now(),
        text: text,
        color: color,
        createdAt: new Date().toISOString()
    };
    
    stickers.push(sticker);
    saveStickers();
    renderStickers();
    
    input.value = '';
    input.focus();
}

// Відобразити стікери
function renderStickers() {
    const board = document.getElementById('stickers-board');
    const emptyBoard = document.getElementById('empty-board');
    
    if (stickers.length === 0) {
        board.innerHTML = '';
        emptyBoard.classList.remove('hidden');
        return;
    }
    
    emptyBoard.classList.add('hidden');
    
    board.innerHTML = stickers.map(sticker => `
        <div class="sticker" style="background: linear-gradient(135deg, ${sticker.color}, ${adjustColor(sticker.color, -30)})" data-id="${sticker.id}">
            <div class="sticker-text" contenteditable="false">${escapeHtml(sticker.text)}</div>
            <div class="sticker-actions">
                <button class="sticker-btn sticker-btn-edit" onclick="editSticker(${sticker.id})" title="Редагувати">✏️</button>
                <button class="sticker-btn sticker-btn-delete" onclick="deleteSticker(${sticker.id})" title="Видалити">✕</button>
            </div>
        </div>
    `).join('');
}

// Редагувати стікер
function editSticker(id) {
    const sticker = stickers.find(s => s.id === id);
    if (!sticker) return;
    
    const stickerEl = document.querySelector(`.sticker[data-id="${id}"] .sticker-text`);
    const isEditable = stickerEl.contentEditable === 'true';
    
    if (isEditable) {
        // Зберігаємо зміни
        stickerEl.contentEditable = 'false';
        sticker.text = stickerEl.textContent.trim();
        saveStickers();
        
        // Змінюємо іконку кнопки
        const editBtn = stickerEl.closest('.sticker').querySelector('.sticker-btn-edit');
        editBtn.textContent = '✏️';
    } else {
        // Починаємо редагування
        stickerEl.contentEditable = 'true';
        stickerEl.focus();
        
        // Виділяємо весь текст
        const range = document.createRange();
        range.selectNodeContents(stickerEl);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Змінюємо іконку кнопки
        const editBtn = stickerEl.closest('.sticker').querySelector('.sticker-btn-edit');
        editBtn.textContent = '💾';
        
        // Обробник для збереження по Enter
        stickerEl.onkeypress = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                editSticker(id);
            }
        };
    }
}

// Видалити стікер
function deleteSticker(id) {
    if (confirm('Видалити цей стікер?')) {
        stickers = stickers.filter(s => s.id !== id);
        saveStickers();
        renderStickers();
    }
}

// Допоміжні функції
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function adjustColor(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + (b | (g << 8) | (r << 16)).toString(16).padStart(6, '0');
}

// ===== ЗАГАДКА ДНЯ (API) =====

const riddleLoading = document.getElementById('riddle-loading');
const riddleCard = document.getElementById('riddle-card');
const riddleError = document.getElementById('riddle-error');
const riddleText = document.getElementById('riddle-text');
const riddleAnswer = document.getElementById('riddle-answer');
const riddleAnswerText = document.getElementById('riddle-answer-text');
const showAnswerBtn = document.getElementById('show-answer-btn');
const newRiddleBtn = document.getElementById('new-riddle-btn');
const retryBtn = document.getElementById('retry-btn');

let currentRiddle = null;

// Завантажити загадку
async function fetchRiddle() {
    // Показуємо завантаження
    riddleLoading.classList.remove('hidden');
    riddleCard.classList.add('hidden');
    riddleError.classList.add('hidden');
    
    try {
        // Спробуємо кілька API
        let riddle = null;
        
        // Спроба 1: riddles-api
        try {
            const response = await fetch('https://riddles-api.vercel.app/api/riddles');
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    riddle = {
                        question: data[0].riddle,
                        answer: data[0].answer
                    };
                }
            }
        } catch (e) {
            console.log('riddles-api не працює, пробуємо інший API...');
        }
        
        // Спроба 2: type.fit (цитати)
        if (!riddle) {
            try {
                const response = await fetch('https://type.fit/api/quotes');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        const randomIndex = Math.floor(Math.random() * data.length);
                        const quote = data[randomIndex];
                        riddle = {
                            question: `"${quote.text}"`,
                            answer: `— ${quote.author || 'Невідомий автор'}`
                        };
                    }
                }
            } catch (e) {
                console.log('type.fit не працює...');
            }
        }
        
        // Спроба 3: quotable
        if (!riddle) {
            try {
                const response = await fetch('https://api.quotable.io/random');
                if (response.ok) {
                    const data = await response.json();
                    riddle = {
                        question: `"${data.content}"`,
                        answer: `— ${data.author || 'Невідомий автор'}`
                    };
                }
            } catch (e) {
                console.log('quotable не працює...');
            }
        }
        
        // Якщо жоден API не працює - використовуємо локальні загадки
        if (!riddle) {
            riddle = getLocalRiddle();
        }
        
        currentRiddle = riddle;
        displayRiddle(riddle);
        
    } catch (error) {
        console.error('Помилка:', error);
        // Використовуємо локальну загадку
        currentRiddle = getLocalRiddle();
        displayRiddle(currentRiddle);
    }
}

// Локальні загадки (fallback)
function getLocalRiddle() {
    const localRiddles = [
        { question: "Має зуби, але не їсть. Має крила, але не літає. Що це?", answer: "Пилка" },
        { question: "Чим більше віднімаєш, тим більше стає. Що це?", answer: "Яма" },
        { question: "Без рук малює, без ніг біжить. Що це?", answer: "Річка" },
        { question: "Одне око, а бачить усе. Що це?", answer: "Голка" },
        { question: "Що можна зламати, не торкаючись?", answer: "Обіцянку" },
        { question: "Яке слово стає коротшим, якщо додати до нього дві літери?", answer: "Коротке" },
        { question: "Що є у кожної людини, але рідко використовується?", answer: "Ім'я" },
        { question: "Без чого не можна почати листа?", answer: "Без конверта" }
    ];
    
    const randomIndex = Math.floor(Math.random() * localRiddles.length);
    return localRiddles[randomIndex];
}

// Відобразити загадку
function displayRiddle(riddle) {
    riddleText.textContent = riddle.question;
    riddleAnswerText.textContent = riddle.answer;
    
    // Ховаємо відповідь
    riddleAnswer.classList.add('hidden');
    showAnswerBtn.textContent = 'Показати відповідь';
    
    // Показуємо картку
    riddleLoading.classList.add('hidden');
    riddleCard.classList.remove('hidden');
    riddleError.classList.add('hidden');
}

// Показати/сховати відповідь
function toggleAnswer() {
    const isHidden = riddleAnswer.classList.contains('hidden');
    
    if (isHidden) {
        riddleAnswer.classList.remove('hidden');
        showAnswerBtn.textContent = 'Сховати відповідь';
    } else {
        riddleAnswer.classList.add('hidden');
        showAnswerBtn.textContent = 'Показати відповідь';
    }
}

// Показати помилку
function showError() {
    riddleLoading.classList.add('hidden');
    riddleCard.classList.add('hidden');
    riddleError.classList.remove('hidden');
}

// Ініціалізація обробників для загадки
document.addEventListener('DOMContentLoaded', function() {
    showAnswerBtn.addEventListener('click', toggleAnswer);
    newRiddleBtn.addEventListener('click', fetchRiddle);
    retryBtn.addEventListener('click', fetchRiddle);
});
