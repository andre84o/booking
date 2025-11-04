# Användningsguide - Booking Calendar

## Installation i annat projekt

### Steg 1: Bygg paketet

I booking-katalogen:

```bash
cd C:/A-project/25webapplication/booking
npm run build:package
```

Detta skapar en `dist`-mapp med compiled JavaScript och TypeScript-definitioner.

### Steg 2: Länka paketet

```bash
npm link
```

### Steg 3: Använd paketet i ditt projekt

I ditt andra Next.js-projekt:

```bash
npm link @yourname/booking-calendar
```

## Användningsexempel

### Exempel 1: Hela applikationen

```tsx
// app/booking/page.tsx
'use client';

import { BookingApp } from '@yourname/booking-calendar';
import '@yourname/booking-calendar/styles';

export default function BookingPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Boka tid</h1>
      <BookingApp />
    </div>
  );
}
```

### Exempel 2: Custom Layout med individuella komponenter

```tsx
'use client';

import { useState, useEffect } from 'react';
import {
  BookingCalendar,
  TimeSlots,
  BookingForm,
  BookingList,
  Modal,
  storage,
  type Booking
} from '@yourname/booking-calendar';
import '@yourname/booking-calendar/styles';

export default function CustomBookingPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setBookings(storage.getBookings());
  }, []);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleBookingSubmit = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };

    storage.saveBooking(newBooking);
    setBookings(storage.getBookings());

    setSelectedDate(null);
    setSelectedTime(null);
    setShowForm(false);
    setModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Välj datum och tid</h2>
        <BookingCalendar
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
          bookedDates={bookings.map(b => b.date)}
        />

        {selectedDate && !showForm && (
          <TimeSlots
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onTimeSelect={handleTimeSelect}
            bookings={bookings}
          />
        )}

        {selectedDate && selectedTime && showForm && (
          <BookingForm
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSubmit={handleBookingSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedTime(null);
            }}
          />
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Mina bokningar</h2>
        <BookingList
          bookings={bookings}
          onDelete={(id) => {
            storage.deleteBooking(id);
            setBookings(storage.getBookings());
          }}
          onEdit={(booking) => {
            // Handle edit
            console.log('Edit booking:', booking);
          }}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Bokning bekräftad!"
        message="Din bokning är bekräftad. Du får en bekräftelse via e-post."
        type="success"
      />
    </div>
  );
}
```

### Exempel 3: Byta till API istället för localStorage

```tsx
// lib/booking-api.ts
import type { Booking } from '@yourname/booking-calendar';

export const bookingApi = {
  getBookings: async (): Promise<Booking[]> => {
    const response = await fetch('/api/bookings');
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },

  saveBooking: async (booking: Booking): Promise<void> => {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (!response.ok) throw new Error('Failed to save booking');
  },

  updateBooking: async (id: string, booking: Booking): Promise<void> => {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (!response.ok) throw new Error('Failed to update booking');
  },

  deleteBooking: async (id: string): Promise<void> => {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete booking');
  },
};
```

Använd sedan API:et istället för `storage`:

```tsx
import { bookingApi } from '@/lib/booking-api';

// I din komponent
const handleBookingSubmit = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
  const newBooking: Booking = {
    ...bookingData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };

  await bookingApi.saveBooking(newBooking);
  const updatedBookings = await bookingApi.getBookings();
  setBookings(updatedBookings);
};
```

## Anpassa styling

### Ändra färger

Skapa din egen CSS-fil:

```css
/* app/custom-booking.css */

/* Ändra primärfärg från blå till grön */
.bg-blue-500 {
  background-color: rgb(34 197 94) !important; /* green-500 */
}

.text-blue-500 {
  color: rgb(34 197 94) !important;
}

.hover\:bg-blue-600:hover {
  background-color: rgb(22 163 74) !important; /* green-600 */
}

/* Anpassa dark mode */
.dark .dark\:bg-zinc-900 {
  background-color: rgb(15 23 42) !important; /* slate-900 */
}
```

Importera tillsammans med standard-styles:

```tsx
import '@yourname/booking-calendar/styles';
import './custom-booking.css';
```

### Använda Tailwind config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          // ...
        }
      }
    }
  }
}
```

## Felsökning

### Problem: "Cannot find module '@yourname/booking-calendar'"

**Lösning:** Se till att du har länkat paketet korrekt:

```bash
# I booking-projektet
npm run build:package
npm link

# I ditt projekt
npm link @yourname/booking-calendar
```

### Problem: "localStorage is not defined"

**Lösning:** Komponenten använder localStorage vilket endast finns i webbläsaren. Se till att använda `'use client'` i din fil.

### Problem: Tailwind styles fungerar inte

**Lösning:** Uppdatera `tailwind.config.js` för att inkludera paketet:

```js
content: [
  './app/**/*.{js,ts,jsx,tsx}',
  './node_modules/@yourname/booking-calendar/**/*.{js,ts,jsx,tsx}',
]
```

## Tips och tricks

### 1. Förhindra att gamla datum kan väljas

Komponenten gör redan detta automatiskt! Bokningar måste göras minst 24 timmar i förväg.

### 2. Lägg till e-postnotifikationer

```tsx
const handleBookingSubmit = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
  // Spara bokning
  const newBooking = { ...bookingData, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  storage.saveBooking(newBooking);

  // Skicka e-post
  await fetch('/api/send-email', {
    method: 'POST',
    body: JSON.stringify({
      to: bookingData.email,
      subject: 'Bokningsbekräftelse',
      booking: newBooking
    })
  });
};
```

### 3. Exportera bokningar till CSV

```tsx
const exportToCSV = () => {
  const bookings = storage.getBookings();
  const csv = [
    ['Datum', 'Tid', 'Namn', 'E-post', 'Telefon'],
    ...bookings.map(b => [b.date, b.timeSlot, b.name, b.email, b.phone])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bokningar.csv';
  a.click();
};
```

## Support

För frågor och support, öppna en issue på GitHub.
