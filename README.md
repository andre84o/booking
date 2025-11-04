# 📅 Booking Calendar

En komplett bokningskalender-lösning för Next.js-applikationer med kalender, tidsplatser och bokningshantering.

## ✨ Funktioner

- 📆 **Interaktiv kalender** - Välj datum med visuell feedback
- ⏰ **Tidsintervaller** - Anpassningsbara tidsplatser (09:00-18:00)
- 📝 **Bokningsformulär** - Validering av namn, e-post, telefon
- 📋 **Bokningslista** - Visa och hantera alla bokningar
- ✏️ **Redigera bokningar** - Ändra datum och tid för befintliga bokningar
- 🚫 **Dubbelbokningsskydd** - Förhindrar överlappande bokningar
- 💾 **LocalStorage** - Automatisk sparning i webbläsaren
- 🎨 **Dark mode** - Stöd för mörkt tema
- 📱 **Responsiv** - Fungerar på alla skärmstorlekar
- 🔔 **Popup-meddelanden** - Snygga bekräftelser istället för alerts

## 📦 Installation

### Alternativ 1: Lokal installation med npm link

I booking-projektet:
```bash
cd C:/A-project/25webapplication/booking
npm run build:package
npm link
```

I ditt andra projekt:
```bash
npm link @yourname/booking-calendar
```

### Alternativ 2: Från lokal fil

```bash
npm install file:../25webapplication/booking
```

### Alternativ 3: Från npm (efter publicering)

```bash
npm install @yourname/booking-calendar
```

## 🚀 Snabbstart

### 1. Hela booking-appen (enklaste sättet)

```tsx
// app/booking/page.tsx
'use client';

import { BookingApp } from '@yourname/booking-calendar';
import '@yourname/booking-calendar/styles';

export default function BookingPage() {
  return <BookingApp />;
}
```

### 2. Anpassa Tailwind CSS

Se till att din `tailwind.config.js` inkluderar paketet:

```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@yourname/booking-calendar/**/*.{js,ts,jsx,tsx}',
  ],
  // ... resten av din config
}
```

## 📋 API Reference

Se [API Documentation](./docs/API.md) för fullständig dokumentation.

## 🔧 Utveckling

Starta utvecklingsservern:
```bash
npm run dev
```

Bygg paketet för distribution:
```bash
npm run build:package
```

## 📄 Licens

MIT

---

Built with ❤️ using Next.js, React, TypeScript and Tailwind CSS
# booking
