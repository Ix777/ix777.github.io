/**
 * =====================
 * КАРТОЧКА "КОНТАКТЫ" - ЛОГИКА
 * =====================
 */
export function initContacts() {
  try {
    const contactsCard = document.getElementById('contacts-card')
    if (!contactsCard) {
      console.warn('Карточка контактов не найдена')
      return
    }
    initContactItems(contactsCard)
    console.log('Модуль контактов инициализирован')
  } catch (error) {
    console.error('Ошибка инициализации модуля контактов:', error)
  }
}

function initContactItems(container) {
  const contactItems = container.querySelectorAll('.card__contact-item')
  if (!contactItems.length) return

  contactItems.forEach(item => {
    item.addEventListener('click', handleContactClick)
  })
}

async function handleContactClick(event) {
  event.stopPropagation()

  // Пропускаем клики по ссылкам
  if (event.target.tagName === 'A') return

  const contactItem = event.currentTarget
  let contactValue = contactItem.dataset.value || ''

  // Корректируем ссылку Telegram
  if (contactValue.startsWith('t.me/')) {
    contactValue = 'https://' + contactValue
  }

  try {
    await navigator.clipboard.writeText(contactValue)
    console.log('Контакт скопирован:', contactValue)
    showCopyFeedback(contactItem)
  } catch (err) {
    console.error('Ошибка копирования:', err)

    // Fallback для старых браузеров
    try {
      const textArea = document.createElement('textarea')
      textArea.value = contactValue
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      showCopyFeedback(contactItem)
    } catch (fallbackErr) {
      console.error('Ошибка при fallback копировании:', fallbackErr)
    }
  }
}

function showCopyFeedback(item) {
  // Сбрасываем предыдущий таймер
  if (item.copyTimeout) {
    clearTimeout(item.copyTimeout)
    item.classList.remove('copied')
  }

  // Добавляем класс для анимации
  item.classList.add('copied')

  // Устанавливаем таймер для сброса
  item.copyTimeout = setTimeout(() => {
    item.classList.remove('copied')
    delete item.copyTimeout
  }, 2000)
}
