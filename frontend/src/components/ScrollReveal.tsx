'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function animateCounter(el: HTMLElement, end: number) {
  const duration = 1.4
  const obj = { val: 0 }
  const decimals = end % 1 !== 0 ? 1 : 0

  gsap.to(obj, {
    val: end,
    duration,
    ease: 'power3.out',
    onUpdate: () => {
      el.textContent = obj.val.toFixed(decimals)
    },
  })
}

export default function ScrollReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Animate [data-animate] elements when they enter viewport
    const animateEls = document.querySelectorAll<HTMLElement>('[data-animate]')

    animateEls.forEach((el) => {
      const type = el.dataset.animate
      const delay = (parseInt(el.dataset.delay ?? '0') * 0.1)

      const from: gsap.TweenVars = { opacity: 0 }
      if (type === 'up') from.y = 40
      if (type === 'left') from.x = -50
      if (type === 'right') from.x = 50
      if (type === 'scale') from.scale = 0.92

      if (type === 'counter') {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const end = parseFloat(el.dataset.count ?? '0')
            gsap.to(el, { opacity: 1, duration: 0.3 })
            animateCounter(el, end)
          },
        })
        gsap.set(el, { opacity: 0 })
        return
      }

      gsap.set(el, from)

      gsap.to(el, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      })
    })

    // Score bar fills
    const bars = document.querySelectorAll<HTMLElement>('.score-bar-fill')
    bars.forEach((bar) => {
      const target = bar.dataset.bar ?? '0'
      gsap.set(bar, { width: '0%' })

      gsap.to(bar, {
        width: `${target}%`,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bar,
          start: 'top 90%',
          once: true,
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return null
}
