import { useEffect, useState } from 'react';

interface CountUpStatProps {
  value?: string;
  end?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export default function CountUpStat({ value, end, prefix = '', suffix = '', label }: CountUpStatProps) {
  const [displayValue, setDisplayValue] = useState('');

  let p = prefix;
  let target = end ?? 0;
  let s = suffix;

  if (value) {
    const match = value.match(/^([^0-9]*)(\d+)(.*)$/);
    if (match) {
      p = match[1];
      target = parseInt(match[2], 10);
      s = match[3];
    } else {
      p = '';
      target = 0;
      s = value;
    }
  }

  const initialFallback = `${p}1${s}`;

  useEffect(() => {
    let animationFrameId: number;
    const duration = 1600; // 1.6s total count-up duration
    const startTime = performance.now();
    const startValue = 1;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth deceleration curve (easeOutCubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(startValue + (target - startValue) * easeOut);

      setDisplayValue(`${p}${currentVal}${s}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(`${p}${target}${s}`);
      }
    };

    // Trigger count-up animation once on page load / mount
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [p, target, s]);

  return (
    <div className="px-8 py-10 text-center select-none">
      <p className="text-3xl md:text-4xl font-bold text-sky-400 mb-1 tracking-tight">
        {displayValue || initialFallback}
      </p>
      <p className="text-xs text-gray-500 tracking-wide uppercase">{label}</p>
    </div>
  );
}

