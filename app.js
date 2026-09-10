// ===== Тренажер для мозку: Логіка та IQ =====

// Базові питання
const defaultQuestions = [
    {
        id: 1,
        question: "Якщо у вас 5 яблук, і ви віддали 2 другу, скільки яблук у вас залишилось?",
        options: ["2", "3", "4", "5"],
        correct: 1,
        category: "Математика"
    },
    {
        id: 2,
        question: "Брат і сестра мають разом 12 іграшок. Якщо брат віддасть сестрі 2 іграшки, у сестри стане на 2 більше, ніж у брата. Скільки іграшок було у сестри спочатку?",
        options: ["4", "5", "6", "7"],
        correct: 1,
        category: "Логіка"
    },
    {
        id: 3,
        question: "Уважно подивись: ●●●○●●○●●○. Яка фігура пропущена?",
        options: ["●", "○", "●●", "○○"],
        correct: 0,
        category: "Уважність"
    },
    {
        id: 4,
        question: "Яка цифра замість знака питання: 2, 6, 12, 20, ?",
        options: ["28", "30", "32", "24"],
        correct: 1,
        category: "Логіка"
    },
    {
        id: 5,
        question: "У якому місяці 28 днів?",
        options: ["Лютий", "У всіх", "Жодному", "Кожен по-різному"],
        correct: 1,
        category: "Загадка"
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
