import { useState, useEffect, useRef } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { Transition } from 'react-d3-speedometer'
export function Speedometer() {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setValue((prevValue) => (prevValue >= 100 ? prevValue : prevValue + 5));
      }, 200);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [inView]);

  return (
    <div ref={ref}>
      <ReactSpeedometer
        value={value}
        minValue={0}
        maxValue={100}
        segments={1}
        ringWidth={10}
        startColor="#84BD32"
        needleTransitionDuration={4000}
        needleTransition={Transition.easeElastic}
        needleHeightRatio={0.7}
        valueTextFontSize="0" // Hide the value text
        labelFontSize="0" // Hide the min/max labels
      />
    </div>
  );
}
