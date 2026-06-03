import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, UserCheck, Mail, Phone, Calendar, Eye, Plus, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPatients, type Patient } from "./api/-clinic";

export const Route = createFileRoute("/patients")({
  head: () => ({
    meta: [
      { title: "Patients — Clinique Moulaye Dabakh" },
      { name: "description", content: "Liste des patients et recherche par email ou nom." },
    ],
  }),
  component: PatientsPage,
});

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleDateString("fr-FR") : "—";
}

function PatientsPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérification de l'accès administrateur
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth !== "true") {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setIsAdmin(true);

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPatients();
        if (!cancelled) {
          setPatients(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Impossible de charger la liste des patients.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (patients ?? []).filter((patient) => {
      const firstName = patient?.firstName || "";
      const lastName = patient?.lastName || "";
      const email = patient?.email || "";
      const phone = patient?.phone || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      return (
        !q ||
        fullName.includes(q) ||
        email.toLowerCase().includes(q) ||
        phone.toLowerCase().includes(q)
      );
    });
  }, [patients, search]);

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-border/40 max-w-md w-full">
          <div className="h-20 w-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Accès Réservé</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Désolé, seul l'administrateur de la clinique peut consulter la liste des patients.
          </p>
          <div className="space-y-3">
            <Button className="w-full rounded-2xl h-12 text-lg font-semibold" asChild>
              <Link to="/admin">Se connecter en tant qu'admin</Link>
            </Button>
            <Button variant="ghost" className="w-full rounded-2xl h-12 text-slate-500" asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-medical font-semibold mb-3">
              Gestion des patients
            </p>
            <h1 className="text-4xl font-bold">Patients</h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Recherchez les dossiers patients, consultez les informations clés et suivez leur
              statut.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-full sm:max-w-sm">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher par nom, email ou téléphone"
                  className="pl-10"
                />
              </label>
            </div>
            <Button asChild>
              <Link to="/patients/new">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau patient
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total patients</p>
                <p className="text-3xl font-bold">{patients.length}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Actifs</Badge>
                <Badge variant="secondary">Inactifs</Badge>
                <Badge variant="secondary">Archivés</Badge>
              </div>
            </div>
          </Card>

          {loading ? (
            <Card className="p-10 text-center text-muted-foreground">Chargement des patients…</Card>
          ) : error ? (
            <Card className="p-10 text-center text-destructive">{error}</Card>
          ) : filtered.length === 0 ? (
            <Card className="p-10 text-center text-muted-foreground">Aucun patient trouvé.</Card>
          ) : (
            <div className="grid gap-4">
              {filtered.map((patient) => (
                <Card key={patient._id} className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold">
                          {patient.firstName} {patient.lastName}
                        </h2>
                        <Badge>{patient.status || "actif"}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{patient.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-sm text-muted-foreground">
                      <div className="inline-flex items-center gap-2">
                        <Phone className="h-4 w-4" /> {patient.phone}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> {formatDate(patient.dateOfBirth)}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <UserCheck className="h-4 w-4" /> {patient.gender || "—"}
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/patients/$patientId" params={{ patientId: patient._id }}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
