import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, AlertCircle, PackageSearch, Pill, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getMedicaments, type Medicament, type MedSlug } from "./api/-medicaments";
import paracetamolImg from "@/assets/meds/paracetamol.jpg";
import ibuprofeneImg from "@/assets/meds/ibuprofene.jpg";
import amoxicillineImg from "@/assets/meds/amoxicilline.jpg";
import aspirineImg from "@/assets/meds/aspirine.jpg";
import dolipraneImg from "@/assets/meds/doliprane.jpg";
import tramadolImg from "@/assets/meds/tramadol.jpg";
import augmentinImg from "@/assets/meds/augmentin.jpg";
import bisoprololImg from "@/assets/meds/bisoprolol.jpg";
import azithromycineImg from "@/assets/meds/azithromycine.jpg";
import panadolImg from "@/assets/meds/panadol.jpg";
import smectaImg from "@/assets/meds/smecta.jpg";
import imodiumImg from "@/assets/meds/imodium.jpg";

const IMG_MAP: Record<MedSlug, string> = {
  paracetamol: paracetamolImg,
  ibuprofene: ibuprofeneImg,
  amoxicilline: amoxicillineImg,
  aspirine: aspirineImg,
  doliprane: dolipraneImg,
  tramadol: tramadolImg,
  augmentin: augmentinImg,
  bisoprolol: bisoprololImg,
  azithromycine: azithromycineImg,
  panadol: panadolImg,
  smecta: smectaImg,
  imodium: imodiumImg,
};

export const Route = createFileRoute("/medicaments")({
  head: () => ({
    meta: [
      { title: "Guide des médicaments — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content:
          "Consultez notre guide des médicaments : fièvre, douleur, infection, cœur. Recherche et filtres en temps réel.",
      },
      { property: "og:title", content: "Guide des médicaments — Clinique Moulaye Dabakh" },
      {
        property: "og:description",
        content: "Recherchez et filtrez les médicaments par catégorie.",
      },
    ],
  }),
  component: MedicamentsPage,
});

type Categorie = Medicament["categorie"];

const CATEGORIES: { value: Categorie | "tous"; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "fievre", label: "Fièvre" },
  { value: "douleur", label: "Douleur" },
  { value: "infection", label: "Infection" },
  { value: "coeur", label: "Cœur" },
  { value: "diarrhee", label: "Diarrhée" },
];

const BADGE_STYLES: Record<Categorie, string> = {
  fievre: "bg-orange-500/20 text-orange-700 border-none",
  douleur: "bg-purple-500/20 text-purple-700 border-none",
  infection: "bg-emerald-500/20 text-emerald-700 border-none",
  coeur: "bg-rose-500/20 text-rose-700 border-none",
  diarrhee: "bg-amber-500/20 text-amber-700 border-none",
};

// Thèmes de couleur par catégorie pour habiller la carte entière
const CARD_THEME: Record<
  Categorie,
  {
    gradient: string;
    shadow: string;
    iconBg: string;
  }
> = {
  fievre: {
    gradient: "from-orange-500 to-amber-600",
    shadow: "shadow-orange-500/20",
    iconBg: "bg-orange-100",
  },
  douleur: {
    gradient: "from-purple-500 to-indigo-700",
    shadow: "shadow-purple-500/20",
    iconBg: "bg-purple-100",
  },
  infection: {
    gradient: "from-emerald-500 to-teal-700",
    shadow: "shadow-emerald-500/20",
    iconBg: "bg-emerald-100",
  },
  coeur: {
    gradient: "from-rose-500 to-red-700",
    shadow: "shadow-rose-500/20",
    iconBg: "bg-rose-100",
  },
  diarrhee: {
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
    iconBg: "bg-amber-100",
  },
};

const CAT_LABEL: Record<Categorie, string> = {
  fievre: "Fièvre",
  douleur: "Douleur",
  infection: "Infection",
  coeur: "Cœur",
  diarrhee: "Diarrhée",
};

// URL d'API configurable. Si vide, on appelle la server function locale.
const API_URL = import.meta.env.VITE_MEDICAMENTS_API_URL as string | undefined;

function MedicamentsPage() {
  const [meds, setMeds] = useState<Medicament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<Categorie | "tous">("tous");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Medicament[];
        if (API_URL) {
          const res = await fetch(API_URL);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          data = await res.json();
        } else {
          data = await getMedicaments();
        }
        if (!cancelled) setMeds(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return meds.filter((m) => {
      const matchCat = activeCat === "tous" || m.categorie === activeCat;
      const matchSearch = !q || m.nom.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [meds, search, activeCat]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.5_0.16_245_/_0.05),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-sm font-medium mb-6">
            <Pill className="mr-2 h-4 w-4" />
            Guide Pratique & Pharmaceutique
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Guide des <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">médicaments</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-muted-foreground leading-relaxed">
            Recherchez un médicament et filtrez par catégorie pour obtenir ses informations
            essentielles. Ce guide est informatif et ne remplace pas un avis médical.
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Barre de recherche + filtres */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="relative max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un médicament (ex: Paracétamol)..."
              className="pl-14 h-16 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 border-none text-lg focus-visible:ring-primary transition-all"
              aria-label="Rechercher un médicament"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => {
              const active = activeCat === cat.value;
              return (
                <Button
                  key={cat.value}
                  size="lg"
                  variant={active ? "default" : "outline"}
                  onClick={() => setActiveCat(cat.value)}
                  className={cn(
                    "rounded-2xl px-8 h-12 font-bold transition-all",
                    active ? "shadow-lg shadow-primary/20" : "bg-white/50 backdrop-blur border-slate-200 hover:bg-white"
                  )}
                >
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* États */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
            <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="font-bold text-lg">Chargement de la pharmacie...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="h-20 w-20 rounded-3xl bg-rose-50 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-rose-500" />
            </div>
            <div>
              <p className="text-slate-900 font-black text-2xl">Oups ! Une erreur est survenue</p>
              <p className="text-slate-500 mt-2 font-medium">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center">
              <PackageSearch className="h-10 w-10 text-slate-400" />
            </div>
            <div>
              <p className="text-slate-900 font-black text-2xl">Aucun médicament trouvé</p>
              <p className="text-slate-500 mt-2 font-medium">
                Essayez un autre mot-clé ou changez de catégorie.
              </p>
            </div>
          </div>
        )}

        {/* Grille */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => {
              const theme = CARD_THEME[m.categorie];
              return (
                <Card
                  key={m.id}
                  className="group relative overflow-hidden rounded-[2.5rem] border-none bg-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="aspect-[4/3] overflow-hidden relative p-8 bg-slate-50 group-hover:bg-white transition-colors duration-500">
                    <img
                      src={IMG_MAP[m.image]}
                      alt={m.nom}
                      loading="lazy"
                      width={800}
                      height={512}
                      className="h-full w-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-xl bg-white shadow-lg text-[10px] font-black uppercase tracking-widest ${BADGE_STYLES[m.categorie]}`}>
                      {CAT_LABEL[m.categorie]}
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
                        {m.nom}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-2 group-hover:line-clamp-none transition-all">
                        {m.description}
                      </p>
                    </div>

                    {/* Prix */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 transition-colors group-hover:bg-emerald-50">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                          Prix Clinique
                        </span>
                        <span className="text-lg font-black text-emerald-700">
                          {m.prixClinic.toLocaleString()} <span className="text-[10px]">FCFA</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors group-hover:bg-white">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Pharmacie ext.
                        </span>
                        <span className="text-lg font-bold text-slate-600">
                          {m.prixPharmacie.toLocaleString()} <span className="text-[10px]">FCFA</span>
                        </span>
                      </div>
                    </div>

                    {/* Ordonnance */}
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm",
                        m.ordonnance ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                      )}>
                        {m.ordonnance ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        {m.ordonnance ? "Sur ordonnance" : "Sans ordonnance"}
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className={cn(
                        "w-full h-14 rounded-2xl font-black text-lg shadow-xl transition-all duration-300",
                        `bg-gradient-to-r ${theme.gradient} hover:opacity-90 hover:${theme.shadow}`
                      )}
                    >
                      🛒 Acheter en ligne
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
