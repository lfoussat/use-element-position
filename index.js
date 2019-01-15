import { useState } from 'react'
import { useElementCallback } from 'use-element'

const { ResizeObserver } = window

const getElementPosition = elem => {
  const rect = elem.getBoundingClientRect()
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
    x: rect.x,
    y: rect.y,
    offsetTop: elem.offsetTop,
    offsetLeft: elem.offsetLeft
  }
}

const useElementPositionModern = callback =>
  useElementCallback(elem => {
    const observer = new ResizeObserver(() => {
      callback(getElementPosition(elem))
    })

    observer.observe(elem)

    return () => observer.unobserve(elem)
  })

const useElementPositionLegacy = callback =>
  useElementCallback(elem => {
    // fallback to window resize
    const onResize = () => {
      callback(getElementPosition(elem))
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
  const [ref, rect] = useElementPosition({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    offsetTop: 0,
    offsetLeft: 0
  })

  return React.createElement(
    'div',
    { ref, ...props },
    React.Children.map(children, child => React.cloneElement(child, rect))
  )
}
