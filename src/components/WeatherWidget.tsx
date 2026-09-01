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
    <div className="flex flex-col items-center justify-center gap-1 bg-[#0e0e13]/60 border border-[#0066ff]/40 rounded-xl px-3 py-3 backdrop-blur-md shadow-[0_0_15px_rgba(0,102,255,0.2)] transition-all hover:border-[#ff24e4]/60">
      <Clock className="w-5 h-5 text-[#ff24e4]" />
      <span className="text-[16px] font-black font-mono tracking-wider text-[#0066ff] leading-none mt-1">
        {time.hours}
      </span>
      <span className="text-[11px] font-bold text-[#849396] leading-none uppercase">
        {time.ampm}
      </span>
    </div>
  );
};
