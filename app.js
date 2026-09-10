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
    updateTotalQuestions();
    loadCustomQuestions();
    renderCustomQuestions();
    
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    addForm.addEventListener('click', addQuestion);
});

// Оновити кількість питань
function updateTotalQuestions() {
    document.getElementById('total-questions').textContent = questions.length;
}

// Завантажити користувацькі питання з localStorage
function loadCustomQuestions() {
    const saved = localStorage.getItem('brainTrainer_questions');
    if (saved) {
        customQuestions = JSON.parse(saved);
        questions = [...defaultQuestions, ...customQuestions];
        updateTotalQuestions();
    }
}

// Зберегти користувацькі питання
function saveCustomQuestions() {
    localStorage.setItem('brainTrainer_questions', JSON.stringify(customQuestions));
}

// Почати тест
function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    
    showScreen('question');
    renderQuestion();
}

// Показати екран
function showScreen(screen) {
    startScreen.classList.remove('active');
    questionScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    
    if (screen === 'start') startScreen.classList.add('active');
    if (screen === 'question') questionScreen.classList.add('active');
    if (screen === 'result') resultScreen.classList.add('active');
}

// Відобразити питання
function renderQuestion() {
    const q = questions[currentQuestion];
    
    // Прогрес-бар
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    
    // Номер та категорія
    document.getElementById('question-number').textContent = 
        `Питання ${currentQuestion + 1} з ${questions.length}`;
    document.getElementById('question-category').textContent = q.category;
    
    // Текст питання
    document.getElementById('question-text').textContent = q.question;
    
    // Відповіді
    const answersHtml = q.options.map((option, index) => 
        `<button class="answer-btn" data-index="${index}">${option}</button>`
    ).join('');
    document.getElementById('answers').innerHTML = answersHtml;
    
    // Додаємо обробники подій
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', selectAnswer);
    });
    
    // Ховаємо кнопку "Далі"
    nextBtn.classList.remove('show');
    answered = false;
}

// Вибрати відповідь
function selectAnswer(e) {
    if (answered) return;
    answered = true;
    
    const selectedIndex = parseInt(e.target.dataset.index);
    const correctIndex = questions[currentQuestion].correct;
    
    // Підсвічуємо правильну та неправильну відповіді
    document.querySelectorAll('.answer-btn').forEach((btn, index) => {
        btn.style.pointerEvents = 'none';
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && selectedIndex !== correctIndex) {
            btn.classList.add('wrong');
        }
    });
    
    // Рахуємо бали
    if (selectedIndex === correctIndex) {
        score++;
    }
    
    // Показуємо кнопку "Далі"
    setTimeout(() => {
        nextBtn.classList.add('show');
        nextBtn.textContent = currentQuestion === questions.length - 1 
            ? 'Показати результат' 
            : 'Наступне питання →';
    }, 500);
}

// Наступне питання
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion >= questions.length) {
        showResult();
    } else {
        renderQuestion();
    }
}

// Показати результат
function showResult() {
    showScreen('result');
    
    const percentage = Math.round((score / questions.length) * 100);
    
    // Визначаємо іконку та повідомлення
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

// Почати знову
function restartQuiz() {
    showScreen('start');
}

// Додати питання
function addQuestion(e) {
    e.preventDefault();
    
    const questionText = document.getElementById('new-question').value.trim();
    const category = document.getElementById('new-category').value;
    const option1 = document.getElementById('new-option1').value.trim();
    const option2 = document.getElementById('new-option2').value.trim();
    const option3 = document.getElementById('new-option3').value.trim();
    const option4 = document.getElementById('new-option4').value.trim();
    
    if (!questionText || !option1 || !option2 || !option3 || !option4) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }
    
    // Створюємо нове питання
    const newQuestion = {
        id: Date.now(),
        question: questionText,
        options: [option1, option2, option3, option4],
        correct: 0, // Перший варіант завжди правильний
        category: category
    };
    
    // Додаємо до списку
    customQuestions.push(newQuestion);
    questions = [...defaultQuestions, ...customQuestions];
    
    // Зберігаємо
    saveCustomQuestions();
    updateTotalQuestions();
    renderCustomQuestions();
    
    // Очищаємо форму
    addForm.reset();
    
    // Показуємо повідомлення
    alert('Питання додано! 🎉');
}

// Відобразити додані питання
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
    
    // Додаємо обробники видалення
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteQuestion);
    });
}

// Видалити питання
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
