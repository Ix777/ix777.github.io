/**
 * =====================
 * МОДУЛЬ КАРТОЧКИ НАВЫКОВ (NEUROSTACK)
 * =====================
 * Инициализация анимации прогресс-бара
 * Оригинальная реализация без изменений
 */

/**
 * Инициализация модуля навыков
 */
export function initSkills() {
  try {
    const skillsCard = document.getElementById('skills-card')
    if (!skillsCard) return
    initAIAnimation(skillsCard)
  } catch (error) {
    console.error('Ошибка инициализации модуля NEUROSTACK:', error)
  }
}

/**
 * Функция инициализации анимации прогресс-бара
 * @param {HTMLElement} container - Родительский контейнер
 */
function initAIAnimation(container) {
  // Получаем элементы DOM
  const dividerTriangle = container.querySelector('.skills-ai-divider-triangle')
  const percentageDisplay = container.querySelector('.skills-ai-percentage-display')
  const pulseRunner = container.querySelector('.skills-ai-pulse-runner')
  const echoPulse = container.querySelector('.skills-ai-echo-pulse')
  const dividerContainer = container.querySelector('.skills-ai-divider-container')

  // Параметры анимации
  const duration = 5000
  const fillTarget = 75
  const percentTarget = 85
  const minGap = 50
  const echoMinPosition = 0.05

  // Переменные состояния
  let startTime = null
  let echoActive = false
  let echoDirection = 1
  let echoPosition = 0

  /**
   * Основная функция анимации
   * @param {DOMHighResTimeStamp} timestamp - Текущее время анимации
   */
  function animateFill(timestamp) {
    if (!startTime) startTime = timestamp
    const progress = timestamp - startTime
    const easedProgress = progress * (progress / duration)
    const fillPercentage = Math.min(Math.floor((progress / duration) * fillTarget), fillTarget)

    // Обновление прогресс-бара
    const maxHeight = 10
    const currentHeight = (fillPercentage / fillTarget) * maxHeight
    dividerTriangle.style.clipPath = `
      polygon(
        0% 50%, 
        ${fillPercentage}% ${50 - currentHeight}%, 
        ${fillPercentage}% ${50 + currentHeight}%
      )
    `

    // Позиционирование элементов
    const containerWidth = dividerContainer.clientWidth
    const impulsePosition = (fillPercentage / 100) * containerWidth
    let percentagePosition = impulsePosition + minGap
    const maxPercentPosition = (percentTarget / 100) * containerWidth
    if (percentagePosition > maxPercentPosition) percentagePosition = maxPercentPosition

    // Обновление позиций
    pulseRunner.style.left = `${impulsePosition}px`
    const thickness = Math.max(2, (fillPercentage / fillTarget) * 4)
    pulseRunner.style.height = `${thickness}px`
    percentageDisplay.style.left = `${percentagePosition}px`
    percentageDisplay.textContent = `${fillPercentage}%`

    // Цветовые переходы
    let color, textColor
    if (fillPercentage < 20) {
      color = '#ff40c6'
      textColor = 'rgb(255, 64, 198)'
    } else if (fillPercentage < 50) {
      const ratio = fillPercentage / 50
      const r = Math.floor(255 - (255 - 250) * ratio)
      const g = Math.floor(64 + (210 - 64) * ratio)
      const b = Math.floor(198 - (198 - 150) * ratio)
      color = `rgb(${r}, ${g}, ${b})`
      textColor = color
    } else {
      const ratio = (fillPercentage - 50) / 25
      const r = Math.floor(250 - (250 - 0) * ratio)
      const g = Math.floor(210 + (255 - 210) * ratio)
      const b = Math.floor(150 + (179 - 150) * ratio)
      color = `rgb(${r}, ${g}, ${b})`
      textColor = color
    }

    // Применение цветов
    pulseRunner.style.background = `
      radial-gradient(
        circle at center,
        white 0%,
        ${color} 30%,
        transparent 70%
      )
    `
    pulseRunner.style.boxShadow = `
      0 0 15px ${color},
      0 0 25px ${color}
    `
    percentageDisplay.style.color = textColor
    const rgb = textColor.match(/\d+/g)
    const r = rgb[0]
    const g = rgb[1]
    const b = rgb[2]
    percentageDisplay.style.textShadow = `
      0 0 6px rgba(${r}, ${g}, ${b}, 0.4),
      0 0 10px rgba(${r}, ${g}, ${b}, 0.7)
    `

    // Активация эхо-эффекта
    if (fillPercentage >= fillTarget && !echoActive) {
      echoActive = true
      echoPosition = impulsePosition
      echoPulse.style.opacity = '1'
    }

    // Анимация эхо-эффекта
    if (echoActive) {
      echoPosition += echoDirection * 2
      const minEchoPosition = echoMinPosition * containerWidth
      if (echoPosition >= impulsePosition) echoDirection = -1
      else if (echoPosition <= minEchoPosition) echoDirection = 1
      echoPulse.style.left = `${echoPosition}px`
      echoPulse.style.height = `${Math.max(1, thickness * 0.75)}px`
    }

    // Продолжение или сброс анимации
    if (progress < duration || echoActive) {
      requestAnimationFrame(animateFill)
    } else {
      startTime = null
      echoActive = false
      echoPosition = 0
      echoDirection = 1
      dividerTriangle.style.clipPath = 'polygon(0 50%, 0 50%, 0 50%)'
      pulseRunner.style.left = '0'
      pulseRunner.style.height = '2px'
      percentageDisplay.style.left = '0'
      percentageDisplay.textContent = '0%'
      echoPulse.style.opacity = '0'
      setTimeout(() => requestAnimationFrame(animateFill), 3000)
    }
  }

  // Запуск анимации
  requestAnimationFrame(animateFill)
}
