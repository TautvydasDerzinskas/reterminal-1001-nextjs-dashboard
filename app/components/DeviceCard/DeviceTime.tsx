'use client';

import { HiClock } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
const getTime = () =>
  new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Warsaw',
  });


export function DeviceTime() {
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="card-cell font-semibold">
      <HiClock size={16} className="inline mr-1" />
      {time}
    </span>
  );
}