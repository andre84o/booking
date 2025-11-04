# Installation Guide

## Snabbinstallation

### För lokal utveckling (rekommenderas)

**Steg 1:** Bygg paketet i booking-projektet

```bash
cd C:/A-project/25webapplication/booking
npm run build:package
npm link
```

**Steg 2:** Länka paketet i ditt andra projekt

```bash
cd /path/to/your/project
npm link @yourname/booking-calendar
```

**Steg 3:** Använd i ditt projekt

```tsx
// app/booking/page.tsx
'use client';

import { BookingApp } from '@yourname/booking-calendar';
import '@yourname/booking-calendar/styles';

export default function BookingPage() {
  return <BookingApp />;
}
```

**Steg 4:** Konfigurera Tailwind CSS

```js
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@yourname/booking-calendar/**/*.{js,ts,jsx,tsx}',
  ],
  // ... resten av din config
}
```

## Alternativ installation

### Via fil-path

```bash
npm install file:C:/A-project/25webapplication/booking
```

### Via relativ path

Om ditt projekt ligger i samma överordnade mapp:

```bash
npm install ../booking
```

## Ta bort länken

Om du vill ta bort länken senare:

```bash
# I ditt projekt
npm unlink @yourname/booking-calendar

# I booking-projektet
npm unlink
```

## Uppdatera paketet

När du gör ändringar i booking-projektet:

```bash
cd C:/A-project/25webapplication/booking
npm run build:package
```

Ändringar kommer automatiskt att reflekteras i länkade projekt.

## Publicera till npm (valfritt)

### Steg 1: Logga in på npm

```bash
npm login
```

### Steg 2: Uppdatera package.json

Ändra `@yourname/booking-calendar` till ditt faktiska npm-användarnamn eller organisation.

### Steg 3: Publicera

```bash
npm publish --access public
```

### Steg 4: Installera från npm

```bash
npm install @yourname/booking-calendar
```

## Felsökning

### Problem: Module not found

**Orsak:** Paketet är inte korrekt länkat.

**Lösning:**
```bash
# Ta bort gamla länkar
npm unlink @yourname/booking-calendar

# Skapa ny länk
cd C:/A-project/25webapplication/booking
npm run build:package
npm link

cd /path/to/your/project
npm link @yourname/booking-calendar
```

### Problem: Changes not reflecting

**Orsak:** Paketet behöver byggas om.

**Lösning:**
```bash
cd C:/A-project/25webapplication/booking
npm run build:package
```

### Problem: TypeScript errors

**Orsak:** Type definitions saknas.

**Lösning:** Se till att `dist/index.d.ts` finns. Om inte, kör:
```bash
npm run build:package
```

## Verifiering

Kontrollera att installationen fungerar:

```tsx
// Test i din app
import { generateTimeSlots, type Booking } from '@yourname/booking-calendar';

console.log(generateTimeSlots());
// Output: ['09:00-10:00', '10:00-11:00', ...]
```

För mer information, se [USAGE.md](./USAGE.md)
