import _classCallCheck from "/Users/jonahallibone/Desktop/react-tilty/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/jonahallibone/Desktop/react-tilty/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/jonahallibone/Desktop/react-tilty/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/jonahallibone/Desktop/react-tilty/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/jonahallibone/Desktop/react-tilty/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';

var Tilty =
/*#__PURE__*/
function (_Component) {
  _inherits(Tilty, _Component);

  function Tilty(props) {
    _classCallCheck(this, Tilty);

    return _possibleConstructorReturn(this, _getPrototypeOf(Tilty).call(this, props));
  }

  _createClass(Tilty, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var settings = this.props.settings || {};
      this.width = null;
      this.height = null;
      this.left = null;
      this.top = null;
      this.transitionTimeout = null;
      this.updateCall = null;
      this.updateBind = this.update.bind(this);
      this.resetBind = this.reset.bind(this);
      this.settings = this.extendSettings(settings);
      this.reverse = this.settings.reverse ? -1 : 1;
      this.glare = this.isSettingTrue(this.settings.glare);
      this.glarePrerender = this.isSettingTrue(this.settings["glare-prerender"]);

      if (this.glare) {
        this.prepareGlare();
      }

      this.addEventListeners();
    }
  }, {
    key: "isSettingTrue",
    value: function isSettingTrue(setting) {
      return setting === "" || setting === true || setting === 1;
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      this.onMouseEnterBind = this.onMouseEnter.bind(this);
      this.onMouseMoveBind = this.onMouseMove.bind(this);
      this.onMouseLeaveBind = this.onMouseLeave.bind(this);
      this.onWindowResizeBind = this.onWindowResizeBind.bind(this);
      this.tilt.addEventListener("mouseenter", this.onMouseEnterBind);
      this.tilt.addEventListener("mousemove", this.onMouseMoveBind);
      this.tilt.addEventListener("mouseleave", this.onMouseLeaveBind);

      if (this.glare) {
        window.addEventListener("resize", this.onWindowResizeBind);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this.transitionTimeout);

      if (this.updateCall !== null) {
        cancelAnimationFrame(this.updateCall);
      }

      this.reset();
      this.removeEventListeners();
      this.tilt.vanillaTilt = null;
      delete this.tilt.vanillaTilt;
      this.tilt = null;
    }
  }, {
    key: "removeEventListeners",
    value: function removeEventListeners() {
      this.tilt.removeEventListener("mouseenter", this.onMouseEnterBind);
      this.tilt.removeEventListener("mousemove", this.onMouseMoveBind);
      this.tilt.removeEventListener("mouseleave", this.onMouseLeaveBind);

      if (this.glare) {
        window.removeEventListener("resize", this.onWindowResizeBind);
      }
    }
  }, {
    key: "onMouseEnter",
    value: function onMouseEnter(event) {
      this.updateElementPosition();
      this.tilt.style.willChange = "transform";
      this.setTransition();
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(event) {
      if (this.updateCall !== null) {
        cancelAnimationFrame(this.updateCall);
      }

      this.event = event;
      this.updateCall = requestAnimationFrame(this.updateBind);
    }
  }, {
    key: "onMouseLeave",
    value: function onMouseLeave(event) {
      this.setTransition();

      if (this.settings.reset) {
        requestAnimationFrame(this.resetBind);
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this.event = {
        pageX: this.left + this.width / 2,
        pageY: this.top + this.height / 2
      };
      this.tilt.style.transform = "perspective(" + this.settings.perspective + "px) " + "rotateX(0deg) " + "rotateY(0deg) " + "scale3d(1, 1, 1)";

      if (this.glare) {
        this.glareElement.style.transform = 'rotate(180deg) translate(-50%, -50%)';
        this.glareElement.style.opacity = '0';
      }
    }
  }, {
    key: "getValues",
    value: function getValues() {
      var x = (this.event.clientX - this.left) / this.width;
      var y = (this.event.clientY - this.top) / this.height;
      x = Math.min(Math.max(x, 0), 1);
      y = Math.min(Math.max(y, 0), 1);
      var tiltX = (this.reverse * (this.settings.max / 2 - x * this.settings.max)).toFixed(2);
      var tiltY = (this.reverse * (y * this.settings.max - this.settings.max / 2)).toFixed(2);
      var angle = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);
      return {
        tiltX: tiltX,
        tiltY: tiltY,
        percentageX: x * 100,
        percentageY: y * 100,
        angle: angle
      };
    }
  }, {
    key: "updateElementPosition",
    value: function updateElementPosition() {
      var rect = this.tilt.getBoundingClientRect();
      this.width = this.tilt.offsetWidth;
      this.height = this.tilt.offsetHeight;
      this.left = rect.left;
      this.top = rect.top;
    }
  }, {
    key: "update",
    value: function update() {
      var values = this.getValues();
      this.tilt.style.transform = "perspective(" + this.settings.perspective + "px) " + "rotateX(" + (this.settings.axis === "x" ? 0 : values.tiltY) + "deg) " + "rotateY(" + (this.settings.axis === "y" ? 0 : values.tiltX) + "deg) " + "scale3d(" + this.settings.scale + ", " + this.settings.scale + ", " + this.settings.scale + ")";

      if (this.glare) {
        this.glareElement.style.transform = "rotate(".concat(values.angle, "deg) translate(-50%, -50%)");
        this.glareElement.style.opacity = "".concat(values.percentageY * this.settings["max-glare"] / 100);
      }

      this.tilt.dispatchEvent(new CustomEvent("tiltChange", {
        "detail": values
      }));
      this.updateCall = null;
    }
    /**
    * Appends the glare element (if glarePrerender equals false)
    * and sets the default style
    */

  }, {
    key: "prepareGlare",
    value: function prepareGlare() {
      // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.
      if (!this.glarePrerender) {
        // Create glare element
        var jsTiltGlare = document.createElement("div");
        jsTiltGlare.classList.add("js-tilt-glare");
        var jsTiltGlareInner = document.createElement("div");
        jsTiltGlareInner.classList.add("js-tilt-glare-inner");
        jsTiltGlare.appendChild(jsTiltGlareInner);
        this.tilt.appendChild(jsTiltGlare);
      }

      this.glareElementWrapper = this.tilt.querySelector(".js-tilt-glare");
      this.glareElement = this.tilt.querySelector(".js-tilt-glare-inner");

      if (this.glarePrerender) {
        return;
      }

      Object.assign(this.glareElementWrapper.style, {
        "position": "absolute",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%",
        "overflow": "hidden"
      });
      Object.assign(this.glareElement.style, {
        'position': 'absolute',
        'top': '50%',
        'left': '50%',
        'pointer-events': 'none',
        'background-image': "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
        'width': "".concat(this.tilt.offsetWidth * 2, "px"),
        'height': "".concat(this.tilt.offsetWidth * 2, "px"),
        'transform': 'rotate(180deg) translate(-50%, -50%)',
        'transform-origin': '0% 0%',
        'opacity': '0'
      });
    }
  }, {
    key: "updateGlareSize",
    value: function updateGlareSize() {
      Object.assign(this.glareElement.style, {
        'width': "".concat(this.tilt.offsetWidth * 2),
        'height': "".concat(this.tilt.offsetWidth * 2)
      });
    }
  }, {
    key: "onWindowResizeBind",
    value: function onWindowResizeBind() {
      this.updateGlareSize();
    }
  }, {
    key: "setTransition",
    value: function setTransition() {
      var _this = this;

      clearTimeout(this.transitionTimeout);
      this.tilt.style.transition = this.settings.speed + "ms " + this.settings.easing;
      if (this.glare) this.glareElement.style.transition = "opacity ".concat(this.settings.speed, "ms ").concat(this.settings.easing);
      this.transitionTimeout = setTimeout(function () {
        _this.tilt.style.transition = "";

        if (_this.glare) {
          _this.glareElement.style.transition = "";
        }
      }, this.settings.speed);
    }
  }, {
    key: "extendSettings",
    value: function extendSettings(settings) {
      var defaultSettings = {
        reverse: false,
        max: 35,
        perspective: 1000,
        easing: "cubic-bezier(.03,.98,.52,.99)",
        scale: "1",
        speed: "300",
        transition: true,
        axis: null,
        glare: false,
        "max-glare": 1,
        "glare-prerender": false,
        reset: true
      };
      var newSettings = {};

      for (var property in defaultSettings) {
        if (property in settings) {
          newSettings[property] = settings[property];
        } else if (this.tilt.hasAttribute("data-tilt-" + property)) {
          var attribute = this.tilt.getAttribute("data-tilt-" + property);

          try {
            newSettings[property] = JSON.parse(attribute);
          } catch (e) {
            newSettings[property] = attribute;
          }
        } else {
          newSettings[property] = defaultSettings[property];
        }
      }

      return newSettings;
    }
  }, {
    key: "render",
    value: function render(e) {
      var _this2 = this;

      return React.createElement("div", Object.assign({
        ref: function ref(elem) {
          return _this2.tilt = elem;
        }
      }, this.props));
    }
  }]);

  return Tilty;
}(Component);

export default Tilty;