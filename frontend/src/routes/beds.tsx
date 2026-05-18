import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BedDouble, ShieldCheck, Building2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBeds, getBedStatistics, type Bed } from "./api/-clinic";

export const Route = createFileRoute("/beds")({
  head: () => ({
    meta: [
      { title: "Lits — Clinique Moulaye Dabakh" },
      { name: "description", content: "Suivi des lits disponibles, occupés et en maintenance." },
    ],
  }),
  component: BedsPage,
});

function BedsPage() {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    occupied: 0,
    available: 0,
    maintenance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [bedList, stats] = await Promise.all([getBeds(), getBedStatistics()]);
        if (!cancelled) {
          setBeds(bedList);
          setStatistics(stats);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Impossible de charger les lits.");
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

  const availableBeds = useMemo(() => beds.filter((bed) => !bed.isOccupied), [beds]);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-medical font-semibold mb-3">
              Gestion des lits
            </p>
            <h1 className="text-4xl font-bold">Lits</h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Visualisez l'état des lits et suivez immédiatement la disponibilité dans chaque
              service.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary">Total {statistics.total}</Badge>
            <Badge variant="secondary">Occupés {statistics.occupied}</Badge>
            <Badge variant="secondary">Disponibles {statistics.available}</Badge>
            <Badge variant="secondary">Maintenance {statistics.maintenance}</Badge>
          </div>
        </div>

        {loading ? (
          <Card className="p-10 text-center text-muted-foreground">Chargement des lits…</Card>
        ) : error ? (
          <Card className="p-10 text-center text-destructive">{error}</Card>
        ) : beds.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">Aucun lit trouvé.</Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {beds.map((bed) => (
              <Card key={bed._id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">Lit {bed.bedNumber}</div>
                    <p className="text-sm text-muted-foreground">Chambre {bed.roomNumber}</p>
                  </div>
                  <Badge
                    variant={
                      bed.isOccupied
                        ? "destructive"
                        : bed.status === "maintenance"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {bed.status}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <div className="font-medium">Service</div>
                    <div className="text-muted-foreground">{bed.department}</div>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <div className="font-medium">Capacité</div>
                    <div className="text-muted-foreground">{bed.capacity}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {availableBeds.includes(bed) ? (
                    <>
                      <ArrowDownRight className="h-4 w-4 text-success" /> Disponible
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-destructive" /> Occupé
                    </>
                  )}
                </div>
                {bed.notes ? (
                  <p className="mt-4 text-sm text-muted-foreground">Note : {bed.notes}</p>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
