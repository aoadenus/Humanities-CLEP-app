"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        void Promise.all(registrations.map((registration) => registration.unregister()));
      });
    }

    if ("caches" in window) {
      void caches.keys().then((keys) => {
        void Promise.all(keys.map((key) => caches.delete(key)));
      });
    }
  }, []);

  return null;
}
