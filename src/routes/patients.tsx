import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, UserCheck, Mail, Phone, CalendarDays, Eye, Plus } from "lucide-react";
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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    return patients.filter((patient) => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      return (
        !q ||
        fullName.includes(q) ||
        patient.email.toLowerCase().includes(q) ||
        patient.phone.toLowerCase().includes(q)
      );
    });
  }, [patients, search]);

  return (
    <div className="bg-[image:var(--gradient-soft)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-medical font-semibold mb-3">Gestion des patients</p>
            <h1 className="text-4xl font-bold">Patients</h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Recherchez les dossiers patients, consultez les informations clés et suivez leur statut.
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
                        <CalendarDays className="h-4 w-4" /> {formatDate(patient.dateOfBirth)}
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
