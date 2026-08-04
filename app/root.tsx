import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { Analytics } from "@vercel/analytics/react";

import type { Route } from "./+types/root";
import "./app.css";
import { visionStylesCss } from "./lib/markdown";
import {
  applyVisionClasses,
  getActiveVisions,
  syncVisionCheckboxes,
  setActiveVisions,
  visionsAfterToggle,
} from "./lib/visions";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
];

// Runs before hydration: sets editorial/hide-unready viewer flags and applies
// active vision classes from ?visions= / localStorage so nothing flashes.
const EARLY_FLAGS_SCRIPT = `(function(){
  var h=location.hostname, local=(h==='localhost'||h==='127.0.0.1'||h===''), r=document.documentElement;
  if(local||/[?&]editorial(=|&|$)/.test(location.search)) r.classList.add('show-editorial');
  if(!local&&!/[?&]showall(=|&|$)/.test(location.search)) r.classList.add('hide-unready');
  var p=new URLSearchParams(location.search).get('visions'), list=[];
  if(p!==null){list=p?p.split(',').filter(Boolean):[];}
  else{try{list=JSON.parse(localStorage.getItem('visions')||'[]');}catch(e){}}
  list.forEach(function(id){r.classList.add('show-vision-'+id);});
})();`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style dangerouslySetInnerHTML={{ __html: visionStylesCss() }} />
        <script dangerouslySetInnerHTML={{ __html: EARLY_FLAGS_SCRIPT }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();

  // Re-sync vision classes + checkboxes after each client navigation, and wire
  // the checkbox change handler once.
  useEffect(() => {
    applyVisionClasses(getActiveVisions());
    syncVisionCheckboxes(getActiveVisions());
  }, [location]);

  useEffect(() => {
    const onChange = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t && (t as HTMLInputElement).matches?.("input[data-vision]")) {
        setActiveVisions(visionsAfterToggle(t as HTMLInputElement));
      }
    };
    document.addEventListener("change", onChange);
    return () => document.removeEventListener("change", onChange);
  }, []);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">{message}</h1>
      <p className="mt-2">{details}</p>
      {stack && (
        <pre className="mt-4 w-full overflow-x-auto rounded bg-neutral-100 p-4 text-sm dark:bg-neutral-900">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
