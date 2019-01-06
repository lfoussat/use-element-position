import { useState } from 'react'
import { useElementCallback } from 'use-element'

const { ResizeObserver } = window

const useElementPositionModern = callback =>
  useElementCallback(elem => {
    const observer = new ResizeObserver(() => {
      callback(elem.getBoundingClientRect())
    })

    observer.observe(elem)

    return () => observer.unobserve(elem)
  })

const useElementPositionLegacy = callback =>
  useElementCallback(elem => {
    // fallback to window resize
    const onResize = () => {
      callback(elem.getBoundingClientRect())
    }

    onResize() // initial value
    window.addEventListener('resize', onResize, { passive: true }) // resized values

    return () => window.removeEventListener('resize', onResize)
  })

export const useElementPositionCallback = ResizeObserver
  ? useElementPositionModern
  : useElementPositionLegacy

export const useElementPosition = defaultValue => {
  const [rect, setRect] = useState(defaultValue)
  const ref = useElementPositionCallback(setRect)
  return [ref, rect]
}

export const WithPosition = ({ children, ...props }) => {
  const [ref, rect] = useElementPosition(new DOMRect())
  const rectProps = {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
    x: rect.x,
    y: rect.y
  }

  return React.createElement(
    'div',
    { ref, ...props },
    React.Children.map(children, child => React.cloneElement(child, rectProps))
  )
}

