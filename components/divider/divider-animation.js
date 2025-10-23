document.addEventListener('DOMContentLoaded', function () {
  const createPulseRunners = () => {
    const divider = document.querySelector('.divider-line')
    if (!divider) return

    // Создаем импульс вправо
    for (let i = 0; i < 1; i++) {
      const pulse = document.createElement('div')
      pulse.className = 'pulse-runner'
      pulse.style.animationDelay = `${i * 2}s`
      divider.appendChild(pulse)
    }

    // Создаем импульс влево
    for (let i = 0; i < 1; i++) {
      const pulse = document.createElement('div')
      pulse.className = 'pulse-runner reverse'
      pulse.style.animationDelay = `${i * 2}s`
      divider.appendChild(pulse)
    }
  }

  createPulseRunners()
})
