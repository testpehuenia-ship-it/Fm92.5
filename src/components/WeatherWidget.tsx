import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const [time, setTime] = useState<{ hours: string, ampm: string }>({ hours: '', ampm: '' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      const formattedMin = m < 10 ? `0${m}` : m;
      setTime({
        hours: `${h}:${formattedMin}`,
        ampm: ampm
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!time.hours) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-1 bg-transparent px-2 py-2">
      <Clock className="w-5 h-5 text-[#ff24e4]" />
      <span className="text-[16px] font-black font-mono tracking-wider text-white leading-none mt-1 animate-neon-breathe shadow-black drop-shadow-md">
        {time.hours}
      </span>
      <span className="text-[11px] font-bold text-[#849396] leading-none uppercase">
        {time.ampm}
      </span>
    </div>
  );
};
