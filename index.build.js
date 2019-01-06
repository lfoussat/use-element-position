"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WithPosition = exports.useElementPosition = exports.useElementPositionCallback = undefined;

var _react = require("react");

var _index = require("use-element/index.mjs");

const {
  ResizeObserver
} = window;

const useElementPositionModern = callback => (0, _index.useElementCallback)(elem => {
  const observer = new ResizeObserver(() => {
    callback(elem.getBoundingClientRect());
  });
  observer.observe(elem);
  return () => observer.unobserve(elem);
});

const useElementPositionLegacy = callback => (0, _index.useElementCallback)(elem => {
  // fallback to window resize
  const onResize = () => {
    callback(elem.getBoundingClientRect());
  };

  onResize(); // initial value

  window.addEventListener('resize', onResize, {
    passive: true
  }); // resized values

  return () => window.removeEventListener('resize', onResize);
});

const useElementPositionCallback = exports.useElementPositionCallback = ResizeObserver ? useElementPositionModern : useElementPositionLegacy;

const useElementPosition = exports.useElementPosition = defaultValue => {
  const [rect, setRect] = (0, _react.useState)(defaultValue);
  const ref = useElementPositionCallback(setRect);
  return [ref, rect];
};

const WithPosition = exports.WithPosition = ({
  children,
  ...props
}) => {
  const [ref, rect] = useElementPosition(new DOMRect());
  const rectProps = {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
    x: rect.x,
    y: rect.y
  };
  return React.createElement('div', {
    ref,
    ...props
  }, React.Children.map(children, child => React.cloneElement(child, rectProps)));
};
