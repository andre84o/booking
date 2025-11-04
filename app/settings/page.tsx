'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '../lib/storage';
import { Settings } from '../types/booking';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [savedMessage, setSavedMessage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load settings when component mounts
    setSettings(storage.getSettings());
  }, []);

  const validateSettings = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!settings) return false;

    // Validate business hours
    if (settings.businessHours.startTime >= settings.businessHours.endTime) {
      newErrors.businessHours = 'Starttid måste vara före sluttid';
    }

    // Validate time interval
    if (settings.timeInterval < 15 || settings.timeInterval > 240) {
      newErrors.timeInterval = 'Tidsintervall måste vara mellan 15 och 240 minuter';
    }

    // Validate business name
    if (!settings.businessName || settings.businessName.trim().length < 2) {
      newErrors.businessName = 'Företagsnamn måste vara minst 2 tecken';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(settings.contactEmail)) {
      newErrors.contactEmail = 'Ange en giltig e-postadress';
    }

    // Validate phone
    if (!settings.contactPhone || settings.contactPhone.length < 8) {
      newErrors.contactPhone = 'Ange ett giltigt telefonnummer';
    }

    // Validate advance booking hours
    if (settings.advanceBookingHours < 0 || settings.advanceBookingHours > 720) {
      newErrors.advanceBookingHours = 'Måste vara mellan 0 och 720 timmar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!settings) return;

    if (!validateSettings()) {
      return;
    }

    storage.saveSettings(settings);

    // Dispatch custom event to notify theme provider of changes
    window.dispatchEvent(new Event('settingsChanged'));

    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Är du säker på att du vill återställa alla inställningar till standardvärden?')) {
      storage.resetSettings();
      setSettings(storage.getSettings());
      setErrors({});

      // Dispatch custom event to notify theme provider of changes
      window.dispatchEvent(new Event('settingsChanged'));

      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Laddar inställningar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tillbaka
          </button>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Inställningar
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Anpassa din bokningskalender
          </p>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Inställningar sparade!</span>
            </div>
          </div>
        )}

        {/* Settings Form */}
        <div className="space-y-6">
          {/* Business Hours */}
          <section className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              Öppettider
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Öppnar
                </label>
                <input
                  type="time"
                  value={settings.businessHours.startTime}
                  onChange={(e) => setSettings({
                    ...settings,
                    businessHours: { ...settings.businessHours, startTime: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Stänger
                </label>
                <input
                  type="time"
                  value={settings.businessHours.endTime}
                  onChange={(e) => setSettings({
                    ...settings,
                    businessHours: { ...settings.businessHours, endTime: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {errors.businessHours && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.businessHours}</p>
            )}
          </section>

          {/* Time Interval */}
          <section className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              Tidsintervall
            </h2>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Bokningslängd (minuter)
              </label>
              <select
                value={settings.timeInterval}
                onChange={(e) => setSettings({ ...settings, timeInterval: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={15}>15 minuter</option>
                <option value={30}>30 minuter</option>
                <option value={45}>45 minuter</option>
                <option value={60}>60 minuter</option>
                <option value={90}>90 minuter</option>
                <option value={120}>120 minuter</option>
              </select>
              {errors.timeInterval && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.timeInterval}</p>
              )}
            </div>
          </section>

          {/* Business Info */}
          <section className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              Företagsinformation
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Företagsnamn
                </label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ditt företagsnamn"
                />
                {errors.businessName && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.businessName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Kontakt e-post
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="info@exempel.se"
                />
                {errors.contactEmail && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.contactEmail}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Telefonnummer
                </label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="070-123 45 67"
                />
                {errors.contactPhone && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.contactPhone}</p>
                )}
              </div>
            </div>
          </section>

          {/* Booking Rules */}
          <section className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              Bokningsregler
            </h2>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Förhandsbokning (timmar i förväg)
              </label>
              <input
                type="number"
                value={settings.advanceBookingHours}
                onChange={(e) => setSettings({ ...settings, advanceBookingHours: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="720"
              />
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Kunder måste boka minst detta antal timmar i förväg
              </p>
              {errors.advanceBookingHours && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.advanceBookingHours}</p>
              )}
            </div>
          </section>

          {/* Appearance */}
          <section className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              Utseende
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Tema
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' | 'system' })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">Ljust</option>
                  <option value="dark">Mörkt</option>
                  <option value="system">Systemstandard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Kalendervy
                </label>
                <select
                  value={settings.calendarView}
                  onChange={(e) => setSettings({ ...settings, calendarView: e.target.value as 'single' | 'dual' })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="single">En månad</option>
                  <option value="dual">Två månader (bredvid varandra)</option>
                </select>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Välj mellan att visa en eller två månader samtidigt
                </p>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              Aviseringar
            </h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-zinc-300 dark:border-zinc-700 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  E-postaviseringar
                </span>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Få e-postbekräftelser för nya bokningar
                </p>
              </div>
            </label>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white active:bg-blue-700 font-medium py-3 px-6 rounded-lg transition-colors shadow-lg cursor-pointer"
            >
              Spara inställningar
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 active:bg-zinc-400 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer shadow-lg"
            >
              Återställ till standard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
