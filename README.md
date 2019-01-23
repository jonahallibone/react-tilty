# react-tilty

A React port of the [vanilla-tilt](https://github.com/micku7zu/vanilla-tilt.js) version of [Tilt.js](https://github.com/gijsroge/tilt.js)

## Installation

This package is hosted on npm

`npm install react-tilty`

## How to Use

This component is imported as a React component

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

Tilty has a variety of options which can be passed in either as a settings object or as properties using `data-tilt-{propertyname}`

Here is a list of available options:
```
{
    reverse:                false,  // reverse the tilt direction
    max:                    35,     // max tilt rotation (degrees)
    perspective:            1000,   // Transform perspective, the lower the more extreme the tilt gets.
    scale:                  1,      // 2 = 200%, 1.5 = 150%, etc..
    speed:                  300,    // Speed of the enter/exit transition
    transition:             true,   // Set a transition on enter/exit.
    axis:                   null,   // What axis should be disabled. Can be X or Y.
    reset:                  true    // If the tilt effect has to be reset on exit.
    easing:                 "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
    glare:                  false   // if it should have a "glare" effect
    "max-glare":            1,      // the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
    "glare-prerender":      false,  // false = VanillaTilt creates the glare elements for you, otherwise
                                    // you need to add .js-tilt-glare>.js-tilt-glare-inner by yourself
    "mouse-event-element":  null    // css-selector or link to HTML-element what will be listen mouse events 
    gyroscope:              true    // Boolean to enable/disable device orientation detection,
    gyroscopeMinAngleX:     -45     // This is the bottom limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the left border of the element;
    gyroscopeMaxAngleX:     45      // This is the top limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the right border of the element;
    gyroscopeMinAngleY:     -45     // This is the bottom limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the top border of the element;
    gyroscopeMaxAngleY:     45      // This is the top limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the bottom border of the element;
}
```

# License

MIT License
