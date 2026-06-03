import { Outlet, Link, createRootRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EmergencyButton } from "@/components/EmergencyButton";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center bg-white p-12 rounded-[2.5rem] shadow-xl">
        <h1 className="text-7xl font-black text-indigo-600">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Page introuvable</h2>
        <p className="mt-2 text-slate-500">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild className="mt-8 rounded-2xl h-12 px-8">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  console.error("Root Error Boundary caught:", error);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-slate-50">
      <div className="max-w-md bg-white p-12 rounded-[2.5rem] shadow-xl">
        <div className="h-20 w-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-rose-600">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Une erreur est survenue</h1>
        <p className="mt-4 text-slate-500 bg-slate-50 p-4 rounded-2xl text-sm font-mono break-words">
          {error.message}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-8 w-full rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-700"
        >
          Recharger la page
        </Button>
      </div>
    </div>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col font-sans antialiased">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <EmergencyButton />
      <Toaster />
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Clinique Moulaye Dabakh — Allo Docteur" },
      {
        name: "description",
        content:
          "Prenez rendez-vous en ligne, téléconsultez et accédez à des soins médicaux modernes à la Clinique Moulaye Dabakh.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap",
      },
    ],
  }),
  component: RootComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
});
