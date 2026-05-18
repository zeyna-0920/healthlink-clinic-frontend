import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, AlertCircle, PackageSearch, Pill } from "lucide-react";
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
  fievre: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  douleur: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  infection: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  coeur: "bg-rose-100 text-rose-700 hover:bg-rose-100",
  diarrhee: "bg-amber-100 text-amber-700 hover:bg-amber-100",
};

// Thèmes de couleur par catégorie pour habiller la carte entière
const CARD_THEME: Record<
  Categorie,
  {
    ring: string;
    imgBg: string;
    title: string;
    accentBar: string;
    button: string;
  }
> = {
  fievre: {
    ring: "hover:border-green-300",
    imgBg: "bg-gradient-to-br from-green-50 to-green-100/60",
    title: "text-green-900",
    accentBar: "bg-gradient-to-r from-green-400 to-green-500",
    button:
      "border-green-200 text-green-700 hover:bg-green-500 hover:text-white hover:border-green-500",
  },
  douleur: {
    ring: "hover:border-green-300",
    imgBg: "bg-gradient-to-br from-green-50 to-green-100/60",
    title: "text-green-900",
    accentBar: "bg-gradient-to-r from-green-400 to-green-500",
    button:
      "border-green-200 text-green-700 hover:bg-green-500 hover:text-white hover:border-green-500",
  },
  infection: {
    ring: "hover:border-green-300",
    imgBg: "bg-gradient-to-br from-green-50 to-green-100/60",
    title: "text-green-900",
    accentBar: "bg-gradient-to-r from-green-400 to-green-500",
    button:
      "border-green-200 text-green-700 hover:bg-green-500 hover:text-white hover:border-green-500",
  },
  coeur: {
    ring: "hover:border-green-300",
    imgBg: "bg-gradient-to-br from-green-50 to-green-100/60",
    title: "text-green-900",
    accentBar: "bg-gradient-to-r from-green-400 to-green-500",
    button:
      "border-green-200 text-green-700 hover:bg-green-500 hover:text-white hover:border-green-500",
  },
  diarrhee: {
    ring: "hover:border-green-300",
    imgBg: "bg-gradient-to-br from-green-50 to-green-100/60",
    title: "text-green-900",
    accentBar: "bg-gradient-to-r from-green-400 to-green-500",
    button:
      "border-green-200 text-green-700 hover:bg-green-500 hover:text-white hover:border-green-500",
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-primary font-medium mb-3">
            <Pill className="h-4 w-4" />
            Guide pratique
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Guide des médicaments
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Recherchez un médicament et filtrez par catégorie pour obtenir ses informations
            essentielles. Ce guide est informatif et ne remplace pas un avis médical.
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Barre de recherche + filtres */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un médicament..."
              className="pl-10 h-11 bg-white/60 backdrop-blur border-border/60"
              aria-label="Rechercher un médicament"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCat === cat.value;
              return (
                <Button
                  key={cat.value}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => setActiveCat(cat.value)}
                  className="rounded-full shadow-sm"
                >
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* États */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Chargement des médicaments...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-foreground font-medium">Impossible de charger les médicaments</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <PackageSearch className="h-10 w-10 text-muted-foreground" />
            <p className="text-foreground font-medium">Aucun médicament trouvé</p>
            <p className="text-sm text-muted-foreground">
              Essayez un autre mot-clé ou changez de catégorie.
            </p>
          </div>
        )}

        {/* Grille */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
            {filtered.map((m) => {
              const theme = CARD_THEME[m.categorie];
              return (
                <Card
                  key={m.id}
                  className={`group relative overflow-hidden p-0 border-2 border-border/60 ${theme.ring} shadow-[var(--shadow-soft)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-white/60 backdrop-blur`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.accentBar}`} />
                  <div
                    className={`aspect-[16/10] overflow-hidden ${theme.imgBg} flex items-center justify-center p-5`}
                  >
                    <img
                      src={IMG_MAP[m.image]}
                      alt={m.nom}
                      loading="lazy"
                      width={800}
                      height={512}
                      className="h-full w-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    <Badge className={`w-fit border-0 ${BADGE_STYLES[m.categorie]}`}>
                      {CAT_LABEL[m.categorie]}
                    </Badge>
                    <h3
                      className={`font-display font-bold text-lg ${theme.title} leading-tight tracking-tight`}
                    >
                      {m.nom}
                    </h3>
                    <p className="text-sm text-muted-foreground/90 leading-relaxed line-clamp-3">
                      {m.description}
                    </p>

                    {/* Prix */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-700">
                          Prix en clinique:
                        </span>
                        <span className="font-bold text-green-800">
                          {m.prixClinic.toLocaleString()} FCFA
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-700">
                          Prix en pharmacie:
                        </span>
                        <span className="font-bold text-green-800">
                          {m.prixPharmacie.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>

                    {/* Ordonnance */}
                    <div className="flex items-center gap-2">
                      <Badge variant={m.ordonnance ? "destructive" : "default"} className="text-xs">
                        {m.ordonnance ? "Sur ordonnance" : "Sans ordonnance"}
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className={`mt-2 w-full font-medium transition-colors ${theme.button}`}
                    >
                      🛒 Acheter
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
