# react-tilty

[![npm version][npm-badge]][npm-url]
[![npm downloads][downloads-badge]][npm-url]
[![npm bundle size][size-badge]][npm-url]
[![license][license-badge]][license-url]

A React port of the [vanilla-tilt.js](https://micku7zu.github.io/vanilla-tilt.js/index.html) version of [Tilt.js](http://gijsroge.github.io/tilt.js/)

_"A tiny requestAnimationFrame powered 60+fps lightweight parallax hover tilt effect for **React**"_

Check out a simple demo [here!](https://codesandbox.io/s/73rqoq599j?fontsize=14)

## Requirements

This package uses hooks internally so it has a requirement of React version 16.8 or above.

## Installation

This package is hosted on [npm](https://www.npmjs.com/package/react-tilty)

```
npm i react-tilty
```

## How to Use

This component is imported and used like any standard React component

```jsx
import React from 'react';
import Tilty from 'react-tilty';

const App = () => {
  return (
    <div class="App">
      <Tilty>
        <div />
      </Tilty>
    </div>
  );
};

export default App;
```

## Props

Tilty has a variety of options which can be passed as props. These have changed in version 2 so they are no longer nested in a `settings` object, or available through `data-` props.

All props are optional besides `children`.

---

### `className` (`string`)

A class name to be applied to the component's wrapper div.

---

### `style` (`React.CSSProperties`)

React styles to be applied to the component's wrapper div.

---

### `reverse` (`boolean`) - Default: `false`

Whether or not to invert the tilt direction.

---

### `max` (`number`) - Default: `35`

The maximum tilt angle in degrees.

Must be between `0` and `180`.

---

### `perspective` (`number`) - Default: `1000`

The perspective of the tilt transform. Lower values mean the tilt effect
is more extreme.

---

### `easing` (`string`) - Default: `'cubic-bezier(0.03,0.98,0.52,0.99)'`

The CSS easing function to use when the mouse enters or leaves the tilt
container.

---

### `speed` (`number`) - Default: `300`

The time in milliseconds the enter/exit transitions will take.

---

### `scale` (`number`) - Default: `1`

The amount to scale the tilt container while hovered, relative to its
normal size.

`1.5` = 150%, `0.5` = 50%, etc.

---

### `axis` (`"X"` | `"Y"`)

Which axis to disable tilting on, if any.

---

### `reset` (`boolean`) - Default: `true`

Whether or not to reset the tilt effect when the mouse leaves the tilt
container.

---

### `glare` (`boolean`) - Default: `false`

Whether or not to add a light glare effect to the tilt container.

---

### `maxGlare` (`number`) - Default: `1`

The maximum opacity of the glare effect.

Must be between `0` and `1`.

---

### `glareStyle` (`React.CSSProperties`)

React styles to be applied to the glare effect component.

---

### `gyroscope` (`boolean`) - Default: `true`

Whether or not to enable tilting on device orientation changes. This only
works on devices that support the [`DeviceOrientationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)
API (e.g. mobile devices).

---

### `gyroscopeMinAngleX` (`number`) - Default: `-45`

This is the bottom limit of the device angle on X axis, meaning that a
device rotated at this angle would tilt the element as if the mouse was on
the left border of the element.

Must be between `-180` and `0`.

---

### `gyroscopeMaxAngleX` (`number`) - Default: `45`

This is the top limit of the device angle on X axis, meaning that a device
rotated at this angle would tilt the element as if the mouse was on the
right border of the element.

Must be between `0` and `180`.

---

### `gyroscopeMinAngleY` (`number`) - Default `-45`

This is the bottom limit of the device angle on Y axis, meaning that a
device rotated at this angle would tilt the element as if the mouse was on
the top border of the element.

Must be between `-180` and `0`.

---

### `gyroscopeMaxAngleY` (`number`) - Default: `45`

This is the top limit of the device angle on Y axis, meaning that a device
rotated at this angle would tilt the element as if the mouse was on the
bottom border of the element.

Must be between `0` and `180`.

---

### `onMouseEnter` (`React.MouseEventHandler<HTMLDivElement>`)

A callback function for the
[`MouseEnter`](https://reactjs.org/docs/events.html#mouse-event) synthetic event
on the wrapping div element.

---

### `onMouseMove` (`React.MouseEventHandler<HTMLDivElement>`)

A callback function for the
[`MouseMove`](https://reactjs.org/docs/events.html#mouse-event) synthetic event
on the wrapping div element.

---

### `onMouseLeave` (`React.MouseEventHandler<HTMLDivElement>`)

A callback function for the
[`MouseLeave`](https://reactjs.org/docs/events.html#mouse-event) synthetic event
on the wrapping div element.

---

### `onTiltChange` (`(event: TiltChangeEvent) => void`)

A callback function for the custom `tiltChange` event on the Tilt
component.

```ts
interface TiltChangeEvent {
  detail: {
    /** @example `"-4.90"` */
    tiltX: string;
    /** @example `"3.03"` */
    tiltY: string;
    /** @example `64` */
    percentageX: number;
    /** @example `58.62` */
    percentageY: number;
    /** @example `121.751281` */
    angle: number;
  };
}
```

---

### `children` (`ReactNode`)

The children to render inside the `Tilt` component.

---

## Example

```jsx
<Tilty reverse axis="x" scale={1.2} perspective={900} reset={false}>
  <div>This is my content</div>
</Tilty>
```

### Creating a Parallax Effect

In order to add a parallax effect to the element and it's child, you must add some css properties to them:

- Add `transform-style: preserve-3d` to your tilt element
- Add `transform: translateZ(Npx)` to your child element (this pixel value `N` can be increased to cause the child element to feel more separated)

```jsx
<Tilty style={{ transformStyle: 'preserve-3d' }}>
  <div style={{ transform: 'translateZ(30px)' }}></div>
</Tilty>
```

### Tilt Change Event

You can pass callback functions for the 3 mouse events, `onMouseEnter`, `onMouseMove`, and `onMouseLeave`. There is also a custom callback `onTiltChange` for the `tiltChange` event that is called the `Tilty` component. This is changed in version 2 from having to manually add en event listener to the dom elements `tiltChange` event, however you can still do this if you'd like.

#### New Way

```jsx
<Tilty
  onMouseEnter={(e) => {
    console.log(e);
  }}
  onMouseMove={(e) => {
    console.log(e);
  }}
  onMouseLeave={(e) => {
    console.log(e);
  }}
  onMouseLeave={(e) => {
    console.log(e);
  }}
  onTiltChange={(e) => {
    console.log(e.detail);
    // {
    //   tiltX: "-4.90",
    //   tiltY: "3.03",
    //   percentageX: 64,
    //   percentageY: 58.666,
    //   angle: 121.751281
    // }
  }}
>
  <div>This is my content</div>
</Tilty>
```

#### Old Way

```jsx
componentDidMount() {
  const tilt = document.querySelector('#tilty');
  tilt.addEventListener("tiltChange", e => {
    console.log(e.detail);
    // {
    //   tiltX: "-4.90",
    //   tiltY: "3.03",
    //   percentageX: 64,
    //   percentageY: 58.666,
    //   angle: 121.751281
    // }
  });
}
```

### Attributions

- [tilt.js](https://github.com/gijsroge/tilt.js) created by [Gijs Rogé](https://github.com/gijsroge)
- [vanilla-tilt.js](https://github.com/micku7zu/vanilla-tilt.js) created by [Șandor Sergiu](https://github.com/micku7zu)

### License

[MIT License](./LICENSE)

[npm-url]: https://www.npmjs.com/package/react-tilty
[license-url]: ./LICENSE
[npm-badge]: https://badge.fury.io/js/react-tilty.svg
[downloads-badge]: https://badgen.net/npm/dt/react-tilty
[size-badge]: https://img.shields.io/bundlephobia/minzip/react-tilty.svg
[dependencies-badge]: https://david-dm.org/jonahallibone/react-tilty/status.svg
[license-badge]: https://badgen.net/npm/license/react-tilty
