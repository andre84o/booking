'use client';

import { useState } from 'react';
import { getDaysInMonth, getMonthName, getWeekdayNames, formatDate } from '../lib/utils';

interface DualCalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
  bookedDates?: string[];
}

export default function DualCalendar({ onDateSelect, selectedDate, bookedDates = [] }: DualCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate first and second month
  const year1 = currentDate.getFullYear();
  const month1 = currentDate.getMonth();

  const secondMonthDate = new Date(year1, month1 + 1, 1);
  const year2 = secondMonthDate.getFullYear();
  const month2 = secondMonthDate.getMonth();

  const days1 = getDaysInMonth(year1, month1);
  const days2 = getDaysInMonth(year2, month2);
  const weekdays = getWeekdayNames();
  const today = formatDate(new Date());

  // Minimum booking date is tomorrow (24 hours in advance)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = formatDate(minDate);

  const previousMonths = () => {
    // Move back 2 months
    setCurrentDate(new Date(year1, month1 - 2, 1));
  };

  const nextMonths = () => {
    // Move forward 2 months
    setCurrentDate(new Date(year1, month1 + 2, 1));
  };

  const isCurrentMonth = (date: Date, monthToCheck: number) => date.getMonth() === monthToCheck;
  const isPastDate = (date: Date) => {
    const dateStr = formatDate(date);
    return dateStr < minDateStr;
  };

  const renderMonth = (days: Date[], month: number, year: number) => {
    return (
      <div className="flex-1 min-w-[280px]">
        {/* Month header */}
        <h3 className="text-lg font-semibold text-center mb-4 text-black dark:text-white">
          {getMonthName(month)} {year}
        </h3>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekdays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-zinc-700 dark:text-zinc-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            const dateStr = formatDate(date);
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === today;
            const inCurrentMonth = isCurrentMonth(date, month);
            const isPast = isPastDate(date);
            const hasBooking = bookedDates.includes(dateStr);

            return (
              <button
                key={index}
                onClick={() => !isPast && onDateSelect(dateStr)}
                disabled={isPast}
                className={`
                  aspect-square p-2 rounded-lg text-sm font-medium transition-all
                  ${!inCurrentMonth ? 'text-zinc-300 dark:text-zinc-700' : 'text-black dark:text-white'}
                  ${isSelected ? 'bg-red-500 text-white hover:bg-red-600' : ''}
                  ${!isSelected && isToday ? 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white font-bold' : ''}
                  ${!isSelected && !isToday && inCurrentMonth && !isPast ? 'hover:bg-zinc-100 dark:hover:bg-zinc-800' : ''}
                  ${isPast ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  ${hasBooking && !isSelected ? 'ring-2 ring-green-500 dark:ring-green-600' : ''}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
      {/* Navigation header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonths}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-700 dark:text-zinc-300"
          aria-label="Föregående 2 månader"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Dubbel månadsvy
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Navigerar 2 månader åt gången
          </p>
        </div>

        <button
          onClick={nextMonths}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-700 dark:text-zinc-300"
          aria-label="Nästa 2 månader"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Two calendars side by side */}
      <div className="flex flex-col lg:flex-row gap-8">
        {renderMonth(days1, month1, year1)}
        <div className="hidden lg:block w-px bg-zinc-200 dark:bg-zinc-700"></div>
        {renderMonth(days2, month2, year2)}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-700 dark:text-zinc-400 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          <span>Idag</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 ring-2 ring-green-500 dark:ring-green-600 rounded"></div>
          <span>Har bokningar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Vald dag</span>
        </div>
      </div>
    </div>
  );
}
