'use client';

import { HiClock } from 'react-icons/hi2';
import { useEffect, useState } from 'react';

export function DeviceTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Europe/Warsaw',
        })
      );
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="card-cell font-semibold">
      <HiClock size={16} className="inline mr-1" />
      {time}
    </span>
  );
}