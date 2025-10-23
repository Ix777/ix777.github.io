/**
 * =====================
 * ГЛАВНЫЙ СКРИПТ ПРИЛОЖЕНИЯ (ФИНАЛЬНАЯ ВЕРСИЯ)
 * =====================
 *
 * Оптимизированная версия:
 * - Только необходимый функционал
 * - Максимальная производительность
 * - Идеальная поддержка карточки "Контакты"
 */

// Импорт компонентов
import { initProfileCard } from '../components/left-column/profile/profile-card.js'
import { initAboutCard } from '../components/left-column/about/about-card.js'
import { initSkills } from '../components/right-column/skills/skills-card.js'
import { initExperience } from '../components/right-column/experience/experience-card.js'
import { initEducation } from '../components/right-column/education/education-card.js'
import { initContacts } from '../components/right-column/contacts/contacts-card.js'

/**
 * Загружает HTML-компонент
 * @param {string} containerId - ID контейнера
 * @param {string} path - Путь к HTML-файлу
 */
async function loadComponent(containerId, path) {
  try {
    const response = await fetch(path)
    if (!response.ok) return false
    document.getElementById(containerId).innerHTML = await response.text()
    return true
  } catch (error) {
    console.error(`Ошибка загрузки ${path}:`, error)
    return false
  }
}

/**
 * Инициализирует анимации с использованием Intersection Observer
 */
function initAnimations() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        // Активация основной анимации
        entry.target.classList.add('active')

        // Специальная обработка для карточки контактов
        if (entry.target.id === 'contacts-card') {
          const items = entry.target.querySelectorAll('.card__contact-item')
          items.forEach((item, i) => {
            setTimeout(() => {
              item.style.opacity = 1
              item.style.transform = 'translateY(0)'
            }, 100 * i) // Задержка для последовательного появления
          })
        }

        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.15 }
  )

  // Применяем к анимируемым элементам
  document.querySelectorAll('.animate-in').forEach(el => {
    // Для контактов - подготовка внутренних элементов
    if (el.id === 'contacts-card') {
      el.querySelectorAll('.card__contact-item').forEach(item => {
        item.style.opacity = 0
        item.style.transform = 'translateY(15px)'
        item.style.transition = 'all 0.4s ease'
      })
    }

    observer.observe(el)
  })
}

/**
 * Основная инициализация приложения
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Загрузка компонентов
  const components = [
    ['profile-container', 'components/left-column/profile/profile-card.html'],
    ['about-container', 'components/left-column/about/about-card.html'],
    ['skills-container', 'components/right-column/skills/skills-card.html'],
    ['experience-container', 'components/right-column/experience/experience-card.html'],
    ['education-container', 'components/right-column/education/education-card.html'],
    ['contacts-container', 'components/right-column/contacts/contacts-card.html']
  ]

  const loadResults = await Promise.all(components.map(([id, path]) => loadComponent(id, path)))

  // Проверка успешной загрузки
  if (loadResults.some(success => !success)) {
    console.warn('Некоторые компоненты не загрузились')
  }

  // Инициализация логики компонентов
  initProfileCard()
  initAboutCard()
  initSkills()
  initExperience()
  initEducation()
  initContacts() // Важно для работы карточки контактов

  // Инициализация анимаций
  initAnimations()

  console.log('Приложение успешно запущено')
})
