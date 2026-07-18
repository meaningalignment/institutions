import { useEffect } from "react";

// Set the <body> className while a route is mounted (the legacy pages used
// body.tab-agi / body.tab-human / body.viewing-detail to drive layout CSS).
// Restores nothing special on unmount — the next route sets its own.
export function useBodyClass(className: string): void {
  useEffect(() => {
    document.body.className = className;
    return () => {
      document.body.className = "";
    };
  }, [className]);
}
