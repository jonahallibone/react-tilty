import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';

function Tilty({
  style = {},
  className = '',
  reverse = false,
  max = 35,
  perspective = 1000,
  easing = 'cubic-bezier(.03,.98,.52,.99)',
  scale = 1,
  speed = 300,
  axis = '',
  reset = true,
  glare = false,
  maxGlare = 1,
  glareStyle = {},
  gyroscope = true,
  gyroscopeMinAngleX = -45,
  gyroscopeMaxAngleX = 45,
  gyroscopeMinAngleY = -45,
  gyroscopeMaxAngleY = 45,
  onMouseEnter = () => {},
  onMouseMove = () => {},
  onMouseLeave = () => {},
  onTiltChange = () => {},
  children,
}) {
  // VARIABLES
  const [styleState, setStyle] = useState({
    position: 'relative',
    willChange: 'transform',
  });
  const [glareStyleState, setGlareStyle] = useState({
    position: 'absolute',
    top: '50%',
    left: '50%',
    pointerEvents: 'none',
    backgroundImage: `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`,
    transform: 'rotate(180deg) translate(-50%, -50%)',
    transformOrigin: '0% 0%',
    opacity: '0',
  });

  const width = useRef(0);
  const height = useRef(0);
  const left = useRef(0);
  const top = useRef(0);
  const transitionTimeout = useRef(null);
  const updateCall = useRef(null);
  const reverseNum = reverse ? 1 : -1;

  const element = useRef(null);

  // UNMOUNT
  useEffect(() => {
    return () => {
      clearTimeout(transitionTimeout.current);
      if (typeof window !== 'undefined') {
        window.cancelAnimationFrame(updateCall.current);
      }
    };
  }, []);

  // GLARE
  useEffect(() => {
    if (!glare || typeof window === 'undefined') {
      return () => {};
    }

    const updateGlareSize = () => {
      setGlareStyle((prevGlareStyle) => ({
        ...prevGlareStyle,
        width: element.current.offsetWidth * 2,
        height: element.current.offsetWidth * 2,
      }));
    };

    window.addEventListener('resize', updateGlareSize);

    return () => {
      window.removeEventListener('resize', updateGlareSize);
    };
  }, [glare]);

  useLayoutEffect(() => {
    setGlareStyle((prevGlareStyle) => ({
      ...prevGlareStyle,
      width: element.current.offsetWidth * 2,
      height: element.current.offsetWidth * 2,
    }));
  }, []);

  // TILT FUNCTIONS
  const updateElementPosition = () => {
    const rect = element.current.getBoundingClientRect();
    width.current = element.current.offsetWidth;
    height.current = element.current.offsetHeight;
    left.current = rect.left;
    top.current = rect.top;
  };

  const getValues = useCallback(
    (e) => {
      let x = (e.nativeEvent.clientX - left.current) / width.current;
      let y = (e.nativeEvent.clientY - top.current) / height.current;

      x = Math.min(Math.max(x, 0), 1);
      y = Math.min(Math.max(y, 0), 1);

      const tiltX = (reverseNum * (max / 2 - x * max)).toFixed(2);
      const tiltY = (reverseNum * (y * max - max / 2)).toFixed(2);

      const angle =
        Math.atan2(
          e.nativeEvent.clientX - (left.current + width.current / 2),
          -(e.nativeEvent.clientY - (top.current + height.current / 2))
        ) *
        (180 / Math.PI);

      const percentageX = x * 100;
      const percentageY = y * 100;

      return {
        tiltX,
        tiltY,
        percentageX,
        percentageY,
        angle,
      };
    },
    [max, reverseNum]
  );

  const update = useCallback(
    (e) => {
      const values = getValues(e);

      setStyle((prevStyle) => ({
        ...prevStyle,
        transform: `perspective(${perspective}px) rotateX(${
          axis.toLowerCase() === 'x' ? 0 : values.tiltY
        }deg) rotateY(${
          axis.toLowerCase() === 'y' ? 0 : values.tiltX
        }deg) scale3d(${scale}, ${scale}, ${scale})`,
      }));

      if (glare) {
        setGlareStyle((prevGlareStyle) => ({
          ...prevGlareStyle,
          transform: `rotate(${values.angle}deg) translate(-50%, -50%)`,
          opacity: (values.percentageY * maxGlare) / 100,
        }));
      }

      // fire tiltChange event and callback
      element.current.dispatchEvent(
        new CustomEvent('tiltChange', {
          detail: values,
        })
      );

      onTiltChange({ detail: values });

      updateCall.current = null;
    },
    [axis, getValues, glare, maxGlare, perspective, scale, onTiltChange]
  );

  const setTransition = () => {
    clearTimeout(transitionTimeout.current);

    setStyle((prevStyle) => ({
      ...prevStyle,
      transition: `${speed}ms ${easing}`,
    }));

    transitionTimeout.current = setTimeout(() => {
      setStyle((prevStyle) => ({
        ...prevStyle,
        transition: '',
      }));
    }, speed);
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        setStyle((prevStyle) => ({
          ...prevStyle,
          transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        }));

        if (glare) {
          setGlareStyle((prevGlareStyle) => ({
            ...prevGlareStyle,
            transform: 'rotate(180deg) translate(-50%, -50%)',
            opacity: 0,
          }));
        }
      });
    }
  };

  // MOUSE EVENTS
  const handleMouseEnter = (e) => {
    updateElementPosition();
    setTransition();
    return onMouseEnter(e);
  };

  const handleMouseMove = (e) => {
    e.persist();
    if (updateCall.current !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(updateCall.current);
    }
    updateCall.current = requestAnimationFrame(() => update(e));
    return onMouseMove(e);
  };

  const handleMouseLeave = (e) => {
    setTransition();

    if (reset) {
      handleReset();
    }

    return onMouseLeave(e);
  };

  // DEVICE GYROSCOPE TILTING
  useEffect(() => {
    if (!gyroscope) {
      return () => {};
    }

    const onDeviceOrientation = (e) => {
      if (
        e.gamma === null ||
        e.beta === null ||
        typeof window === 'undefined'
      ) {
        return;
      }

      updateElementPosition();

      const totalAngleX = gyroscopeMaxAngleX - gyroscopeMinAngleX;
      const totalAngleY = gyroscopeMaxAngleY - gyroscopeMinAngleY;

      const degreesPerPixelX = totalAngleX / width.current;
      const degreesPerPixelY = totalAngleY / height.current;

      const angleX = e.gamma - gyroscopeMinAngleX;
      const angleY = e.beta - gyroscopeMinAngleY;

      const posX = angleX / degreesPerPixelX;
      const posY = angleY / degreesPerPixelY;

      if (updateCall.current !== null && typeof window !== 'undefined') {
        window.cancelAnimationFrame(updateCall.current);
      }

      e.nativeEvent = {
        clientX: posX + left.current,
        clientY: posY + top.current,
      };

      updateCall.current = requestAnimationFrame(() => update(e));
    };

    window.addEventListener('deviceorientation', onDeviceOrientation);

    return () => {
      window.removeEventListener('deviceorientation', onDeviceOrientation);
    };
  }, [
    gyroscope,
    gyroscopeMaxAngleX,
    gyroscopeMaxAngleY,
    gyroscopeMinAngleX,
    gyroscopeMinAngleY,
    update,
  ]);

  return (
    <div
      ref={element}
      style={{
        ...style,
        ...styleState,
      }}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {glare && (
        <div
          className="tilty-glare-wrapper"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <div
            className="tilty-glare"
            style={{
              ...glareStyle,
              ...glareStyleState,
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
}

export default Tilty;
