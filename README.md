# react-tilty

A React port of the [vanilla-tilt.js](https://micku7zu.github.io/vanilla-tilt.js/index.html) version of [Tilt.js](http://gijsroge.github.io/tilt.js/)

It's a tiny 3D tilt javascript library powered by requestAnimationFrame

## Installation

This package is hosted on [npm](https://www.npmjs.com/package/react-tilty)

`npm install react-tilty`

## How to Use

This component is imported and used like any standard React component

```
import React, { Component } from "react";
import Tilty from "react-tilty";

class App extends Component {
  render() {
    return (
        <Tilty></Tilty>
    );
  }
}

export default App;
```

## Options

Tilty has a variety of options which can be passed in either as a settings object prop or as individual properties using `data-tilt-{propertyname}`

Here is a list of available options with their defaults:
```
settings={{
    reverse:                false,  // reverse the tilt direction
    max:                    35,     // max tilt rotation (degrees)
    perspective:            1000,   // Transform perspective, the lower the more extreme the tilt gets.
    scale:                  1,      // 2 = 200%, 1.5 = 150%, etc..
    speed:                  300,    // Speed of the enter/exit transition
    transition:             true,   // Set a transition on enter/exit.
    axis:                   null,   // What axis should be disabled. Can be X or Y.
    reset:                  true,   // If the tilt effect has to be reset on exit.
    easing:                 "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
    glare:                  false,  // if it should have a "glare" effect
    "max-glare":            1,      // the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
    "glare-prerender":      false,  // false = VanillaTilt creates the glare elements for you, otherwise
                                    // you need to add .js-tilt-glare>.js-tilt-glare-inner by yourself
    "mouse-event-element":  null,   // css-selector or link to HTML-element what will be listen mouse events 
    gyroscope:              true,   // Boolean to enable/disable device orientation detection,
    gyroscopeMinAngleX:     -45,    // This is the bottom limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the left border of the element;
    gyroscopeMaxAngleX:     45,     // This is the top limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the right border of the element;
    gyroscopeMinAngleY:     -45,    // This is the bottom limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the top border of the element;
    gyroscopeMaxAngleY:     45      // This is the top limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the bottom border of the element;
}}
```

Example:

```
<Tilty
  data-tilt-reverse="true"
  data-tilt-axis="x"
  settings = {{
    scale: 1.2,
    perspective: 900,
    reset: false
  }}>
</Tilty>
```

### Creating a Parallax Effect

In order to add a parallax effect to the element and it's child, you must add some css properties to them:
- Add `transform-style: preserve-3d` to your tilt element
- Add `transform: translateZ(20px)` to your child element (this pixel value can be increased to cause the child element to feel more separated)


```
<Tilty
  style={{
    transformStyle: "preserve-3d"
  }}>
  <div
    style={{
      transform: "translateZ(30px)"
    }}>
  </div>
</Tilty>
```

### Tilt Change Event

You can add an event listener to the component's `tiltChange` event in order to access it's x and y tilts, percentages, and overall angle

```
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

## License

[MIT License](./LICENSE)
