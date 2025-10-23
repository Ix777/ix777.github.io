// ================= КОНФИГУРАЦИЯ АНИМАЦИИ =================
const SETTINGS = {
  durations: {
    base: 3000, // Базовая длительность показа
    random: 1000, // Случайный разброс
    stepMin: 5, // Минимальная задержка между символами
    stepMax: 10, // Максимальная задержка
    initialDelay: 4000 // Задержка перед стартом
  },
  glow: {
    primary: '0 0 20px #00f3ff', // Фиксированные значения
    accent: '0 0 18px #fd53ef' // вместо переменных
  },
  colors: {
    primary: '#00f3ff',
    secondary: '#ff2975',
    accent: '#9d4edd',
    text: '#e0f7fa',
    // Оптимизированная палитра:
    green: '#00ff9d',
    yellow: '#ffe600',
    cyan: '#00f7ff',
    pink: '#ff2a95',
    purple: '#c95fff',
    orange: '#ff7700'
  },
  animation: {
    totalSteps: 42, // Общее количество шагов анимации
    intensityVariation: 0.1 // Сила колебаний свечения
  }
}

// Расширенный набор символов для технологичного эффекта
const TECH_SYMBOLS = '01|[]{}<>()*+#&%$§≡≈≋⌬⌺⌻⌼⍇⍈⍉⍊⍋⍎⍏⍐⍑⍒⍓⍔⍕⍖⍘⍙⍚⍛⍜⍝⍞⍟⍠⍡'

// Оптимизированные сообщения с улучшенной структурой
const MESSAGES = [
  { symbol: '👋', text: 'Приветствую вас! Меня зовут AI.' },
  { symbol: '🌐', text: 'Я цифровой помощник создателя.' },

  { symbol: '✨', text: 'Добро пожаловать в наше цифровое пространство!' },
  { symbol: '💫', text: 'Здесь каждая деталь наполнена любовью к творчеству.' },

  { symbol: '💖', text: 'Мой создатель — настоящий мастер разработки:' },
  { symbol: '👨‍💻', text: 'Fullstack-разработчик с 3-летним опытом.' },
  { symbol: '🌐', text: 'Он создаёт завораживающие цифровые миры.' },

  { symbol: '🎮', text: 'Его страсть — оживлять воображение:' },
  { symbol: '👓', text: 'Гипнотические 3D-визуализации', indent: 1 },
  { symbol: '🌀', text: 'Плавные анимации, точные как часы', indent: 1 },
  { symbol: '•', text: 'Интерактивные элементы-игрушки', indent: 1 },
  { symbol: '🖱️', text: 'которые играют с вашим курсором', indent: 2 },

  { symbol: '🧩', text: 'Он виртуозно владеет технологиями:' },
  { symbol: '🪄', text: 'JavaScript — волшебная палочка', indent: 1 },
  { symbol: '🔮', text: 'для оживления страниц', indent: 2 },
  { symbol: '🧠', text: 'Python — мастер логических решений', indent: 1 },
  { symbol: '🖌️', text: 'Three.js — кисть для 3D-вселенных', indent: 1 },

  // Новый блок про алгоритмы и автоматизацию
  { symbol: '⚙️', text: 'Его суперсила — оптимизация:' },
  { symbol: '🔢', text: 'Разработка умных алгоритмов', indent: 1 },
  { symbol: '🤖', text: 'Автоматизация сложных процессов', indent: 1 },
  { symbol: '🚀', text: 'Превращение рутины в эффективные решения', indent: 2 },

  { symbol: '❤️', text: 'Каждый его проект — это история!' },
  { symbol: '🔍', text: 'Рассказанная через внимание к деталям.' },

  { symbol: '🌟', text: 'Особенно любит нестандартные задачи.' },
  { symbol: '🚪', text: 'Где другие видят стену — он создаёт дверь.' },

  { symbol: '🏆', text: 'Эта страница — лучшее доказательство его мастерства!' },
  { symbol: '❓', text: 'Вы уже заметили плавные переходы?' },
  { symbol: '🌌', text: 'Элементы появляются из пустоты...' },
  { symbol: '🌌', text: 'Неоновые цвета и импульсы как в космосе ...' },
  { symbol: '🌌', text: 'Каждый элемент чувствует вас ...' },
  { symbol: '🌠', text: 'Вы оценили 3D Анимацию вселенной!' },
  { symbol: '💓', text: 'Это наше сердечко' },
  { symbol: '😴', text: 'Я засыпаю под его космический танец.', indent: 1 },

  { symbol: '🎨', text: 'Палитра цветов —' },
  { symbol: '🌈', text: 'как северное сияние.', indent: 1 },
  { symbol: '💌', text: 'Ваша идея может стать следующим шедевром!' },
  { symbol: '🤝', text: 'Буду рад, если вдохновитесь его работами!' },
  { symbol: '📬', text: 'Его контакты — мостик к новым возможностям.' },

  { symbol: '🕊️', text: 'Ваше внимание согревает наши сердца.' },
  { symbol: '☀️', text: 'Оно дарит нам свет и энергию!' }
]

// ================= ОПТИМИЗАЦИЯ ДОСТУПА К DOM =================
const textElement = document.getElementById('textElement')
const loadingIndicator = document.getElementById('loadingIndicator')

// Проверка элементов с выводом предупреждения
if (!textElement || !loadingIndicator) {
  console.warn('Элементы анимации не найдены! Проверьте ID элементов')
}

// ================= ИНИЦИАЛИЗАЦИЯ ИНДИКАТОРА =================
/**
 * Инициализирует индикатор загрузки с анимированными точками
 * @param {number} count - Количество точек
 */
function initLoadingIndicator(count = 5) {
  if (!loadingIndicator) return

  loadingIndicator.innerHTML = Array(count)
    .fill()
    .map((_, i) => `<div class="loading-dot" style="--delay:${i * 0.2}s"></div>`)
    .join('')
}

// ================= ПРЕДВАРИТЕЛЬНАЯ ЗАГРУЗКА =================
/** Предзагружает символы для предотвращения мерцания */
function preloadSymbols() {
  const preloadContainer = document.createElement('div')
  Object.assign(preloadContainer.style, {
    position: 'absolute',
    visibility: 'hidden',
    opacity: '0',
    pointerEvents: 'none'
  })

  MESSAGES.forEach(({ symbol }) => {
    const el = document.createElement('span')
    el.className = 'neon-symbol'
    el.textContent = symbol
    preloadContainer.appendChild(el)
  })

  document.body.appendChild(preloadContainer)

  // Удаление после отрисовки
  requestAnimationFrame(() => {
    document.body.removeChild(preloadContainer)
  })
}

// ================= ФУНКЦИИ УПРАВЛЕНИЯ СВЕЧЕНИЕМ =================
/**
 * Устанавливает интенсивность свечения
 * @param {number} intensity - Уровень интенсивности (0-1)
 */
function setGlowIntensity(intensity) {
  if (!textElement) return

  // Пересчет теней на основе интенсивности
  const primarySize = 20 * intensity
  const accentSize = 18 * intensity

  textElement.style.textShadow = `0 0 ${primarySize}px #00f3ff, 0 0 ${accentSize}px #fd53ef`
}

// ================= ОСНОВНЫЕ ФУНКЦИИ АНИМАЦИИ =================
/**
 * Отображает сообщение с анимированным символом
 * @param {Object} message - Объект сообщения {symbol, text}
 */
function showMessage({ symbol, text }) {
  const colors = Object.values(SETTINGS.colors)
  const color = colors[Math.floor(Math.random() * colors.length)]

  textElement.innerHTML = `
    <span class="neon-symbol" style="color:${color}">${symbol}</span>
    <span class="message-text">${text}</span>
  `

  // Восстановление стандартного свечения
  setGlowIntensity(1)

  textElement.classList.add('pulsating')
}

/**
 * Анимирует переход между сообщениями
 * @param {Object} newMessage - Новое сообщение
 * @returns {Promise} - Промис завершения анимации
 */
async function techTextTransform(newMessage) {
  return new Promise(resolve => {
    const { symbol, text } = newMessage
    const fullText = symbol + text
    let step = 0

    textElement.classList.remove('pulsating')

    const transformStep = () => {
      let output = ''
      const progress = step / SETTINGS.animation.totalSteps

      // Генерация промежуточного текста
      for (let i = 0; i < fullText.length; i++) {
        const char =
          progress < 1 && Math.random() > progress
            ? TECH_SYMBOLS.charAt((Math.random() * TECH_SYMBOLS.length) | 0)
            : fullText.charAt(i)

        output += char
      }

      // Динамическое свечение
      const intensity = 0.2 + Math.sin(step * 0.2) * SETTINGS.animation.intensityVariation
      setGlowIntensity(intensity)
      textElement.textContent = output
      step++

      if (step < SETTINGS.animation.totalSteps) {
        const delay =
          SETTINGS.durations.stepMin +
          Math.random() * (SETTINGS.durations.stepMax - SETTINGS.durations.stepMin)
        setTimeout(transformStep, delay)
      } else {
        showMessage(newMessage)
        resolve()
      }
    }

    transformStep()
  })
}

/** Возвращает приветствие в зависимости от времени суток */
function getTimeBasedGreeting() {
  const hour = new Date().getHours()
  const greetings = [
    { max: 5, symbol: '🌙', text: 'Доброй ночи!' },
    { max: 12, symbol: '☀️', text: 'Доброе утро!' },
    { max: 18, symbol: '⛅', text: 'Добрый день!' },
    { max: 24, symbol: '🌙', text: 'Добрый вечер!' }
  ]

  return greetings.find(g => hour < g.max)
}

/** Главная функция запуска анимации */
async function startTechAnimation() {
  if (!textElement) return

  try {
    // Приветствие
    await techTextTransform(getTimeBasedGreeting())
    await delay(SETTINGS.durations.base * 1.8)

    // Основная последовательность
    for (const message of MESSAGES) {
      await techTextTransform(message)

      const duration = SETTINGS.durations.base + Math.random() * SETTINGS.durations.random

      await delay(message.isSeparator ? duration * 1.5 : duration)
    }

    // Финальное состояние
    textElement.classList.remove('pulsating')
    setGlowIntensity(1)
  } catch (err) {
    console.error('Animation error:', err)
    // Fallback
    textElement.textContent = 'Добро пожаловать!'
    textElement.classList.add('visible')
  }
}

/** Утилита задержки */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// ================= ИНИЦИАЛИЗАЦИЯ =================
document.addEventListener('DOMContentLoaded', () => {
  if (!textElement || !loadingIndicator) return

  preloadSymbols()
  initLoadingIndicator()

  // Показ индикатора
  loadingIndicator.style.display = 'flex'

  setTimeout(() => {
    textElement.classList.add('visible')

    // Установка стандартного свечения
    setGlowIntensity(1)

    // Плавное скрытие индикатора
    loadingIndicator.style.opacity = '0'
    setTimeout(() => {
      loadingIndicator.style.display = 'none'
      startTechAnimation()
    }, 1000)
  }, SETTINGS.durations.initialDelay)
})
