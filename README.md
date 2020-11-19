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

`npm i react-tilty`

## How to Use

This component is imported and used like any standard React component

```jsx
import React from 'react';
import Tilty from 'react-tilty';

const App = () => {
  return (
    <div class="App">
      <Tilty></Tilty>
    </div>
  );
};

export default App;
```

## Props

Tilty has a variety of options which can be passed as props. These have changed in version 2.0 so they are no longer nested in a `settings` object, or available through `data-` props.

Here is a list of available options with their defaults:

```js
style:                  {}      // A jsx style object that will be applied to the root element
className:              ''      // A className to be added to the Tilty element
reverse:                false   // Reverse the tilt direction
max:                    35      // Max tilt rotation (degrees)
perspective:            1000    // Transform perspective, the lower the more extreme the tilt gets.
scale:                  1       // 2 = 200%, 1.5 = 150%, etc..
speed:                  300     // Speed of the enter/exit transition
axis:                   null    // What axis should be disabled, can be X or Y.
reset:                  true    // If the tilt effect has to be reset on exit
easing:                 "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit
glare:                  false   // if it should have a "glare" effect
maxGlare:               1       // the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
glareStyle:             {}      // A jsx style prop to be added to the glare element if glare is enabled
gyroscope:              true    // Boolean to enable/disable device orientation detection
gyroscopeMinAngleX:     -45     // This is the bottom limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the left border of the element
gyroscopeMaxAngleX:     45      // This is the top limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the right border of the element
gyroscopeMinAngleY:     -45     // This is the bottom limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the top border of the element
gyroscopeMaxAngleY:     45      // This is the top limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the bottom border of the element
onMouseEnter:           (e) => {} // A callback function for the mouse enter event on the Tilt component
onMouseMove:            (e) => {} // A callback function for the mouse move event on the Tilt component
onMouseLeave:           (e) => {} // A callback function for the mouse leave event on the Tilt component
onTiltChange:           (e) => {} // A callback function for the custom tiltChange event on the Tilt component
                                  // e = {
                                  //   detail: {
                                  //     tiltX: "-4.90",
                                  //     tiltY: "3.03",
                                  //     percentageX: 64,
                                  //     percentageY: 58.666,
                                  //     angle: 121.751281
                                  //   }
                                  // }
```

**Example:**

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
