document.addEventListener('DOMContentLoaded', function () {
  const initNeuralAnimation = () => {
    if (window.innerWidth <= 900) return;
    const canvas = document.getElementById('neural-animation')
    if (!canvas) return

    const container = document.querySelector('.animation-top')
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: canvas
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const neonColors = [
      new THREE.Color(0x00d0ff),
      new THREE.Color(0x00c0ff),
      new THREE.Color(0x5fa8ff),
      new THREE.Color(0x9d8eff),
      new THREE.Color(0xc17bff),
      new THREE.Color(0xff6ec7),
      new THREE.Color(0xff8ab3)
    ]

    const coreGeometry = new THREE.IcosahedronGeometry(1, 5, 1)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x5fa8ff,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
      blending: THREE.AdditiveBlending
    })
    const coreNeuron = new THREE.Mesh(coreGeometry, coreMaterial)
    scene.add(coreNeuron)

    const innerCoreGeometry = new THREE.SphereGeometry(0.05, 12, 12)
    const innerCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending
    })
    const innerCore = new THREE.Mesh(innerCoreGeometry, innerCoreMaterial)
    coreNeuron.add(innerCore)

    const particleCount = 100
    const particles = []
    const lines = []
    const coreLines = []
    const glowingParticles = []

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/sprites/snowflake1.png',
      function (texture) {
        const spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          color: neonColors[0],
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending
        })

        const positions = fibonacciSphere(particleCount)
        for (let i = 0; i < positions.length; i++) {
          const pos = positions[i]
          const material = spriteMaterial.clone()
          const sprite = new THREE.Sprite(material)
          sprite.position.copy(pos)
          sprite.scale.set(0.4, 0.4, 1)
          sprite.userData = {
            base: pos.clone(),
            phase: Math.random() * Math.PI * 2,
            sizePhase: Math.random() * Math.PI * 2,
            opacityPhase: Math.random() * Math.PI * 2,
            colorPhase: Math.random() * Math.PI * 2
          }
          scene.add(sprite)
          particles.push(sprite)
        }

        const connectionsPerParticle = 6
        for (let i = 0; i < particles.length; i++) {
          const current = particles[i].position
          const distances = []
          for (let j = 0; j < particles.length; j++) {
            if (i === j) continue
            const other = particles[j].position
            const dist = current.distanceTo(other)
            distances.push({ index: j, distance: dist })
          }
          distances.sort((a, b) => a.distance - b.distance)
          for (let k = 0; k < connectionsPerParticle && k < distances.length; k++) {
            const j = distances[k].index
            const p1 = particles[i].position
            const p2 = particles[j].position
            const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(1)
            const controlPoint = midPoint
              .clone()
              .add(
                new THREE.Vector3(
                  (Math.random() - 0.5) * 0.2,
                  (Math.random() - 0.5) * 0.2,
                  (Math.random() - 0.5) * 0.2
                )
              )
            const curve = new THREE.QuadraticBezierCurve3(p1, controlPoint, p2)
            const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(6))
            const lineMaterial = new THREE.LineBasicMaterial({
              color: neonColors[0],
              transparent: true,
              opacity: 0.5,
              blending: THREE.AdditiveBlending,
              linewidth: 1
            })
            const line = new THREE.Line(curveGeometry, lineMaterial)
            line.userData = {
              from: particles[i],
              to: particles[j],
              baseControl: controlPoint.clone(),
              currentControl: controlPoint.clone(),
              pulsePhase: Math.random() * Math.PI * 2,
              colorPhase: Math.random() * Math.PI * 2
            }
            scene.add(line)
            lines.push(line)
          }
        }

        const glowingParticleCount = 100
        for (let i = 0; i < glowingParticleCount; i++) {
          const geometry = new THREE.SphereGeometry(0.08, 1, 2)
          const colorIndex = Math.floor(Math.random() * neonColors.length)
          const baseColor = neonColors[colorIndex].clone()
          const material = new THREE.MeshBasicMaterial({
            color: baseColor,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
          })
          const lineIndex = Math.floor(Math.random() * lines.length)
          const line = lines[lineIndex]
          const progress = Math.random()
          const speed = (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1)
          const particle = new THREE.Mesh(geometry, material)
          particle.userData = {
            lineIndex: lineIndex,
            progress: progress,
            speed: speed,
            baseSize: 0.06 + Math.random() * 0.03,
            pulseSpeed: 4 + Math.random() * 3,
            baseColor: baseColor
          }
          const curve = new THREE.QuadraticBezierCurve3(
            line.userData.from.position,
            line.userData.currentControl,
            line.userData.to.position
          )
          const point = curve.getPoint(progress)
          particle.position.copy(point)
          scene.add(particle)
          glowingParticles.push(particle)
        }

        const coreConnections = 30
        for (let i = 0; i < coreConnections; i++) {
          const randomParticle = particles[Math.floor(Math.random() * particles.length)]
          const startPoint = new THREE.Vector3(0, 0, 0)
          const endPoint = randomParticle.position.clone()
          const controlPoint = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
          )
          const curve = new THREE.QuadraticBezierCurve3(startPoint, controlPoint, endPoint)
          const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(0.5))
          const coreLineMaterial = new THREE.LineBasicMaterial({
            color: neonColors[2],
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending,
            linewidth: 0.5
          })
          const coreLine = new THREE.Line(curveGeometry, coreLineMaterial)
          coreLine.userData = {
            from: coreNeuron,
            to: randomParticle,
            controlPoint: controlPoint,
            pulsePhase: Math.random() * Math.PI * 1,
            speed: 0.8 + Math.random() * 0.1,
            colorPhase: Math.random() * Math.PI * 1
          }
          scene.add(coreLine)
          coreLines.push(coreLine)
        }

        animate()
      },
      undefined,
      function (error) {
        console.error('Ошибка загрузки текстуры снежинки:', error)
      }
    )

    function fibonacciSphere(samples) {
      const points = []
      const phi = Math.PI * (2 - Math.sqrt(5))
      for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2
        const radius = Math.sqrt(1 - y * y)
        const theta = phi * i
        const x = Math.cos(theta) * radius
        const z = Math.sin(theta) * radius
        points.push(new THREE.Vector3(x * 2, y * 2, z * 2))
      }
      return points
    }

    let time = 0
    const colorChangeSpeed = 0.25

    function getNeonGradient(t) {
      const totalColors = neonColors.length
      const progress = (t * totalColors) % totalColors
      const index1 = Math.floor(progress)
      const index2 = (index1 + 1) % totalColors
      const fraction = progress - index1
      const smoothFraction = fraction * fraction * (3 - 2 * fraction)
      const color = neonColors[index1].clone()
      return color.lerp(neonColors[index2], smoothFraction)
    }

    function animate() {
      requestAnimationFrame(animate)
      time += 0.005

      const globalColorTime = time * colorChangeSpeed
      const coreColor = getNeonGradient(globalColorTime)
      const particleColor = getNeonGradient(globalColorTime + 0.12)
      const lineColor = getNeonGradient(globalColorTime + 0.24)
      const coreLineColor = getNeonGradient(globalColorTime + 0.36)

      coreNeuron.rotation.x = time * 0.18
      coreNeuron.rotation.y = time * 0.18

      const corePulse = Math.sin(time * 1.0) * 0.2 + 1
      coreNeuron.scale.set(corePulse, corePulse, corePulse)

      innerCore.material.opacity = 0.85 + Math.sin(time * 5) * 0.1
      innerCore.material.color.copy(getNeonGradient(globalColorTime * 1.6)).multiplyScalar(1.4)

      particles.forEach(p => {
        const offset = Math.sin(time + p.userData.phase) * 0.015
        p.position.x = p.userData.base.x + Math.sin(time * 0.5 + p.userData.phase) * offset
        p.position.y = p.userData.base.y + Math.cos(time * 0.5 + p.userData.phase * 2) * offset
        p.position.z = p.userData.base.z + Math.sin(time * 0.5 + p.userData.phase * 3) * offset

        const sizePulse = Math.sin(time * 2.5 + p.userData.sizePhase) * 0.05
        p.scale.set(0.1 + sizePulse, 0.1 + sizePulse, 1)

        const opacityPulse = Math.sin(time * 1.5 + p.userData.opacityPhase) * 1
        p.material.opacity = 0.9 + opacityPulse * 0.9

        p.material.color.copy(particleColor)
      })

      lines.forEach(line => {
        const p1 = line.userData.from.position
        const p2 = line.userData.to.position
        const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)

        const pulse = Math.sin(time * 0.7 + line.userData.pulsePhase) * 0.1
        const controlPoint = midPoint
          .clone()
          .add(
            new THREE.Vector3(
              pulse * Math.cos(time * 0.6 + line.userData.pulsePhase),
              pulse * Math.sin(time * 0.6 + line.userData.pulsePhase * 1.5),
              pulse * Math.cos(time * 0.6 + line.userData.pulsePhase * 2)
            )
          )
        line.userData.currentControl = controlPoint.clone()
        const curve = new THREE.QuadraticBezierCurve3(p1, controlPoint, p2)
        line.geometry.setFromPoints(curve.getPoints(50))

        line.material.color.copy(lineColor)
        line.material.opacity = 0.35 + Math.sin(time * 0.6 + line.userData.pulsePhase) * 0.15
      })

      glowingParticles.forEach(p => {
        const line = lines[p.userData.lineIndex]
        if (!line) return
        const curve = new THREE.QuadraticBezierCurve3(
          line.userData.from.position,
          line.userData.currentControl,
          line.userData.to.position
        )
        p.userData.progress += p.userData.speed
        if (p.userData.progress > 1 || p.userData.progress < 0) {
          p.userData.speed *= -1
          p.userData.progress = Math.max(0, Math.min(1, p.userData.progress))
        }
        const point = curve.getPoint(p.userData.progress)
        p.position.copy(point)

        const glowPulse = Math.sin(time * p.userData.pulseSpeed) * 0.1 + 0.1
        p.material.opacity = 0.85 + glowPulse * 0.5

        const sizePulse = Math.sin(time * 2) * 0.06
        const currentSize = p.userData.baseSize + sizePulse
        p.scale.set(currentSize, currentSize, currentSize)

        if ((p.userData.progress >= 0.99 || p.userData.progress <= 0.01) && Math.random() < 0.4) {
          p.userData.lineIndex = Math.floor(Math.random() * lines.length)
        }
      })

      coreLines.forEach((line, index) => {
        const startPoint = new THREE.Vector3(0, 0, 0)
        const endPoint = line.userData.to.position.clone()

        const pulse = Math.sin(time * line.userData.speed + line.userData.pulsePhase) * 0.3
        line.userData.controlPoint.x += (Math.random() - 0.5) * 0.03
        line.userData.controlPoint.y += (Math.random() - 0.5) * 0.03
        line.userData.controlPoint.z += (Math.random() - 0.5) * 0.03
        line.userData.controlPoint.normalize().multiplyScalar(2 + pulse)

        const curve = new THREE.QuadraticBezierCurve3(
          startPoint,
          line.userData.controlPoint.clone(),
          endPoint
        )
        line.geometry.dispose()
        line.geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(10))

        line.material.color.copy(coreLineColor)
        line.material.opacity = 0.55 + Math.sin(time * 0.4 + line.userData.pulsePhase) * 0.15

        if (Math.random() < 0.0006) {
          const newTarget = particles[Math.floor(Math.random() * particles.length)]
          line.userData.to = newTarget
        }
      })

      camera.position.x = Math.sin(time * 0.18) * 6
      camera.position.y = Math.cos(time * 0.13) * 1.5
      camera.position.z = Math.cos(time * 0.18) * 6
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    function handleResize() {
      const container = canvas.parentElement
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
  }

  if (document.getElementById('neural-animation')) {
    initNeuralAnimation()
  }
})
