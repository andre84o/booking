
'use client';

import { generateTimeSlots } from '../lib/utils';
import { Booking } from '../types/booking';

interface TimeSlotsProps {
  selectedDate: string;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  bookings: Booking[];
}

export default function TimeSlots({ selectedDate, selectedTime, onTimeSelect, bookings }: TimeSlotsProps) {
  const timeSlots = generateTimeSlots();
  const bookedSlots = bookings
    .filter(b => b.date === selectedDate)
    .map(b => b.timeSlot);

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Välj tid</h3>

      <div className="grid grid-cols-2 gap-3">
        {timeSlots.map(slot => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = slot === selectedTime;

          return (
            <button
              key={slot}
              onClick={() => !isBooked && onTimeSelect(slot)}
              disabled={isBooked}
              className={`
                p-3 rounded-lg text-sm font-medium transition-all
                ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                ${!isSelected && !isBooked ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700' : ''}
                ${isBooked ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 cursor-not-allowed line-through' : 'cursor-pointer'}
              `}
            >
              {slot}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
        <p>Öppettider: 09:00 - 18:00</p>
      </div>
    </div>
  );
}
