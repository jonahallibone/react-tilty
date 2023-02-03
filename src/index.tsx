import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export interface TiltChangeDetails {
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
}

export interface Coordinates {
  clientX: number;
  clientY: number;
}

export interface TiltyProps {
  /**
   * A class name to be applied to the component's wrapper div.
   */
  className?: string;

  /**
   * React styles to be applied to the component's wrapper div.
   */
  style?: CSSProperties;

  /**
   * Whether or not to invert the tilt direction.
   *
   * @defaultValue `false`
   */
  reverse?: boolean;

  /**
   * The maximum tilt angle in degrees.
   *
   * Must be between `0` and `180`.
   *
   * @defaultValue `35`
   */
  max?: number;

  /**
   * The perspective of the tilt transform. Lower values mean the tilt effect
   * is more extreme.
   *
   * @defaultValue `1000`
   */
  perspective?: number;

  /**
   * The CSS easing function to use when the mouse enters or leaves the tilt
   * container.
   *
   * @defaultValue `'cubic-bezier(0.03,0.98,0.52,0.99)'`
   */
  easing?: string;

  /**
   * The time in milliseconds the enter/exit transitions will take.
   *
   * @defaultValue `300`
   */
  speed?: number;

  /**
   * The amount to scale the tilt container while hovered, relative to its
   * normal size.
   *
   * `1` = 100%, `0.5` = 50%, etc.
   *
   * @defaultValue `1`
   */
  scale?: number;

  /**
   * Which axis to disable tilting on, if any.
   */
  axis?: 'X' | 'Y';

  /**
   * Whether or not to reset the tilt effect when the mouse leaves the tilt
   * container.
   *
   * @defaultValue `true`
   */
  reset?: boolean;

  /**
   * Whether or not to add a light glare effect to the tilt container.
   *
   * @defaultValue `false`
   */
  glare?: boolean;

  /**
   * The maximum opacity of the glare effect.
   *
   * Must be between `0` and `1`.
   *
   * @defaultValue `1`
   */
  maxGlare?: number;

  /**
   * React styles to be applied to the glare effect component.
   */
  glareStyle?: CSSProperties;

  /**
   * Whether or not to enable device orientation (gyroscope) support. This only
   * works on devices that support the DeviceOrientationEvent API (e.g. mobile
   * devices).
   *
   * @defaultValue `true`
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent}
   */
  gyroscope?: boolean;

  /**
   * This is the bottom limit of the device angle on X axis, meaning that a
   * device rotated at this angle would tilt the element as if the mouse was on
   * the left border of the element.
   *
   * Must be between `-180` and `0`.
   *
   * @defaultValue `-45`
   */
  gyroscopeMinAngleX?: number;

  /**
   * This is the top limit of the device angle on X axis, meaning that a device
   * rotated at this angle would tilt the element as if the mouse was on the
   * right border of the element.
   *
   * Must be between `0` and `180`.
   *
   * @defaultValue `45`
   */
  gyroscopeMaxAngleX?: number;

  /**
   * This is the bottom limit of the device angle on Y axis, meaning that a
   * device rotated at this angle would tilt the element as if the mouse was on
   * the top border of the element.
   *
   * Must be between `-180` and `0`.
   *
   * @defaultValue `-45`
   */
  gyroscopeMinAngleY?: number;

  /**
   * his is the top limit of the device angle on Y axis, meaning that a device
   * rotated at this angle would tilt the element as if the mouse was on the
   * bottom border of the element.
   *
   * Must be between `0` and `180`.
   *
   * @defaultValue `45`
   */
  gyroscopeMaxAngleY?: number;

  /**
   * A callback function for the `MouseEnter` synthetic event on the wrapping
   * div element.
   *
   * @see {@link https://reactjs.org/docs/events.html#mouse-events}
   */
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;

  /**
   * A callback function for the `MouseMove` synthetic event on the wrapping
   * div element.
   *
   * @see {@link https://reactjs.org/docs/events.html#mouse-events}
   */
  onMouseMove?: MouseEventHandler<HTMLDivElement>;

  /**
   * A callback function for the `MouseLeave` synthetic event on the wrapping
   * div element.
   *
   * @see {@link https://reactjs.org/docs/events.html#mouse-events}
   */
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;

  /**
   * A callback function for the custom `tiltChange` event on the Tilt
   * component.
   *
   * @param event - A custom event object with a `detail` property containing
   * tilt angles.
   */
  onTiltChange?: (event: { detail: TiltChangeDetails }) => void;

  /**
   * The children to render inside the `Tilt` component.
   */
  children: ReactNode;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const Tilty = ({
  style = {},
  className = '',
  reverse = false,
  max = 35,
  perspective = 1000,
  easing = 'cubic-bezier(0.03,0.98,0.52,0.99)',
  speed = 300,
  scale = 1,
  axis,
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
}: TiltyProps) => {
  // VARIABLES
  const [styleState, setStyle] = useState<CSSProperties>({
    position: 'relative',
    willChange: 'transform',
  });
  const [glareStyleState, setGlareStyle] = useState<CSSProperties>({
    position: 'absolute',
    top: '50%',
    left: '50%',
    pointerEvents: 'none',
    backgroundImage: `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`,
    transform: 'rotate(180deg) translate(-50%, -50%)',
    transformOrigin: '0% 0%',
    opacity: '0',
  });

  const width = useRef<number>(0);
  const height = useRef<number>(0);
  const left = useRef<number>(0);
  const top = useRef<number>(0);
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);
  const updateCall = useRef<number | null>(null);

  const reverseNum = reverse ? 1 : -1;

  const element = useRef<HTMLDivElement>(null);

  // UNMOUNT
  useEffect(
    () => () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
      if (typeof window !== 'undefined' && updateCall.current) {
        window.cancelAnimationFrame(updateCall.current);
      }
    },
    []
  );

  // GLARE
  useEffect(() => {
    if (!glare || typeof window === 'undefined') {
      return () => {};
    }

    const updateGlareSize = () => {
      const { current: currentEl } = element;
      if (currentEl !== null) {
        setGlareStyle((prevGlareStyle) => ({
          ...prevGlareStyle,
          width: currentEl.offsetWidth * 2,
          height: currentEl.offsetWidth * 2,
        }));
      }
    };

    window.addEventListener('resize', updateGlareSize);

    return () => {
      window.removeEventListener('resize', updateGlareSize);
    };
  }, [glare]);

  useIsomorphicLayoutEffect(() => {
    const { current: currentEl } = element;
    if (currentEl !== null) {
      setGlareStyle((prevGlareStyle) => ({
        ...prevGlareStyle,
        width: currentEl.offsetWidth * 2,
        height: currentEl.offsetWidth * 2,
      }));
    }
  }, []);

  // TILT FUNCTIONS
  const updateElementPosition = () => {
    const { current: currentEl } = element;
    if (currentEl !== null) {
      const rect = currentEl.getBoundingClientRect();
      width.current = currentEl.offsetWidth;
      height.current = currentEl.offsetHeight;
      left.current = rect.left;
      top.current = rect.top;
    }
  };

  const getValues = useCallback(
    (coordinates: Coordinates) => {
      let x = (coordinates.clientX - left.current) / width.current;
      let y = (coordinates.clientY - top.current) / height.current;

      x = Math.min(Math.max(x, 0), 1);
      y = Math.min(Math.max(y, 0), 1);

      const tiltX = (reverseNum * (max / 2 - x * max)).toFixed(2);
      const tiltY = (reverseNum * (y * max - max / 2)).toFixed(2);

      const angle =
        Math.atan2(
          coordinates.clientX - (left.current + width.current / 2),
          -(coordinates.clientY - (top.current + height.current / 2))
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
    (coordinates: Coordinates) => {
      const values = getValues(coordinates);

      setStyle((prevStyle) => ({
        ...prevStyle,
        transform: `perspective(${perspective}px) rotateX(${
          axis?.toLowerCase() === 'x' ? 0 : values.tiltY
        }deg) rotateY(${
          axis?.toLowerCase() === 'y' ? 0 : values.tiltX
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
      if (element.current) {
        element.current.dispatchEvent(
          new CustomEvent('tiltChange', {
            detail: values,
          })
        );
      }

      onTiltChange({ detail: values });

      updateCall.current = null;
    },
    [axis, getValues, glare, maxGlare, perspective, scale, onTiltChange]
  );

  const setTransition = () => {
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
      transitionTimeout.current = null;
    }

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
  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = (e) => {
    updateElementPosition();
    setTransition();
    return onMouseEnter(e);
  };

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    e.persist();
    if (updateCall.current !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(updateCall.current);
    }
    const coordinates = {
      clientX: e.clientX,
      clientY: e.clientY,
    };
    updateCall.current = requestAnimationFrame(() => update(coordinates));
    return onMouseMove(e);
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = (e) => {
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

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (typeof window === 'undefined' || !e.gamma || !e.beta) {
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

      if (updateCall.current !== null) {
        window.cancelAnimationFrame(updateCall.current);
      }

      const coordinates = {
        clientX: posX + left.current,
        clientY: posY + top.current,
      };

      updateCall.current = requestAnimationFrame(() => update(coordinates));
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
};

export default Tilty;
