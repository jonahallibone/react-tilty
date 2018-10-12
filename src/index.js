import React, { Component } from 'react';

class Tilty extends Component {
    constructor(props) {
        super(props);
        
    }

    componentDidMount() {

        let settings = this.props.settings || {};
        
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

    isSettingTrue(setting) {
        return setting === "" || setting === true || setting === 1;
    }

    addEventListeners() {
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

    componentWillUnmount() {
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

    removeEventListeners() {
        this.tilt.removeEventListener("mouseenter", this.onMouseEnterBind);
        this.tilt.removeEventListener("mousemove", this.onMouseMoveBind);
        this.tilt.removeEventListener("mouseleave", this.onMouseLeaveBind);
        if (this.glare) {
          window.removeEventListener("resize", this.onWindowResizeBind);
        }
    }

    onMouseEnter(event) {
        this.updateElementPosition();
        this.tilt.style.willChange = "transform";
        this.setTransition();
    }
    
    onMouseMove(event) {
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
    
        this.event = event;
        this.updateCall = requestAnimationFrame(this.updateBind);
    }
    
    onMouseLeave(event) {
        this.setTransition();
    
        if (this.settings.reset) {
          requestAnimationFrame(this.resetBind);
        }
    }

    reset() {
        this.event = {
          pageX: this.left + this.width / 2,
          pageY: this.top + this.height / 2
        };
    
        this.tilt.style.transform = "perspective(" + this.settings.perspective + "px) " +
          "rotateX(0deg) " +
          "rotateY(0deg) " +
          "scale3d(1, 1, 1)";
    
        if (this.glare) {
          this.glareElement.style.transform = 'rotate(180deg) translate(-50%, -50%)';
          this.glareElement.style.opacity = '0';
        }
    }

    getValues() {
        let x = (this.event.clientX - this.left) / this.width;
        let y = (this.event.clientY - this.top) / this.height;
    
        x = Math.min(Math.max(x, 0), 1);
        y = Math.min(Math.max(y, 0), 1);
    
        let tiltX = (this.reverse * (this.settings.max / 2 - x * this.settings.max)).toFixed(2);
        let tiltY = (this.reverse * (y * this.settings.max - this.settings.max / 2)).toFixed(2);
        let angle = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);
    
        return {
            tiltX: tiltX,
            tiltY: tiltY,
            percentageX: x * 100,
            percentageY: y * 100,
            angle: angle
        };
    }

    updateElementPosition() {
        let rect = this.tilt.getBoundingClientRect();
    
        this.width = this.tilt.offsetWidth;
        this.height = this.tilt.offsetHeight;
        this.left = rect.left;
        this.top = rect.top;
    }

    update() {
        let values = this.getValues();
    
        this.tilt.style.transform = "perspective(" + this.settings.perspective + "px) " +
            "rotateX(" + (this.settings.axis === "x" ? 0 : values.tiltY) + "deg) " +
            "rotateY(" + (this.settings.axis === "y" ? 0 : values.tiltX) + "deg) " +
            "scale3d(" + this.settings.scale + ", " + this.settings.scale + ", " + this.settings.scale + ")";
    
        if (this.glare) {
            this.glareElement.style.transform = `rotate(${values.angle}deg) translate(-50%, -50%)`;
            this.glareElement.style.opacity = `${values.percentageY * this.settings["max-glare"] / 100}`;
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
    prepareGlare() {
        // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.
        if (!this.glarePrerender) {
        // Create glare element
        const jsTiltGlare = document.createElement("div");
        jsTiltGlare.classList.add("js-tilt-glare");

        const jsTiltGlareInner = document.createElement("div");
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
            'background-image': `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`,
            'width': `${this.tilt.offsetWidth * 2}px`,
            'height': `${this.tilt.offsetWidth * 2}px`,
            'transform': 'rotate(180deg) translate(-50%, -50%)',
            'transform-origin': '0% 0%',
            'opacity': '0',
        });
    }

    updateGlareSize() {
        Object.assign(this.glareElement.style, {
          'width': `${this.tilt.offsetWidth * 2}`,
          'height': `${this.tilt.offsetWidth * 2}`,
        });
    }
    
    onWindowResizeBind() {
        this.updateGlareSize();
    }

    setTransition() {
        clearTimeout(this.transitionTimeout);
        this.tilt.style.transition = this.settings.speed + "ms " + this.settings.easing;
        if (this.glare) this.glareElement.style.transition = `opacity ${this.settings.speed}ms ${this.settings.easing}`;
    
        this.transitionTimeout = setTimeout(() => {
            this.tilt.style.transition = "";
            if (this.glare) {
                this.glareElement.style.transition = "";
            }
        }, this.settings.speed);
    
    }
    extendSettings(settings) {
        let defaultSettings = {
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
    
        let newSettings = {};
        for (var property in defaultSettings) {
            if (property in settings) {
                newSettings[property] = settings[property];
            } 
            
            else if (this.tilt.hasAttribute("data-tilt-" + property)) {
                let attribute = this.tilt.getAttribute("data-tilt-" + property);
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
    
    
    

    render(e) {

        return( 
            <div ref={elem => this.tilt = elem} {...this.props}></div>
        )
    }




}

export default Tilty;

