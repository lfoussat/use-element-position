# use-element-position

React hook to get bounding client rect

## Usage

```js
import { useElementPosition } from 'use-element-position'

const MyComponent = () => {
  const [ref, { width }] = useElementPosition({ width: 0 })

  return (
    <div ref={ref}>
      My width is {width}px
    </div>
  )
}
```

Or use the wrapper component

```js
import { WithPosition } from 'use-element-position'

const MyComponent = ({ width }) => (
  <div>
    My width is {width}px
  </div>
)

const MyWrapperComponent = () => (
  <WithPosition>
    <MyComponent />
  </WithPosition>
)
```

You can retrieve all the properties included in [`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) :
bottom, height, left, right, top, width, x, y
You can also retrieve offsetTop and offsetLeft's values of your element.
