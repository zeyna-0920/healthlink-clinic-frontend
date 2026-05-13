import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, BedDouble, CreditCard, Bell, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getPatients,
  getBeds,
  getBedStatistics,
  getPayments,
  getNotifications,
  type Patient,
  type Bed,
  type Payment,
  type Notification,
} from "./api/-clinic";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content: "Tableau de bord avec statistiques patients, lits, paiements et notifications.",
      },
    ],
  }),
  component: DashboardPage,
});

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR");
}

function formatCurrency(amount: number, currency: string = "XOF") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  loading,
  trend,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subtext?: string;
  loading?: boolean;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <Card className="p-6 border border-border/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}`}>
            <TrendingUp className="h-4 w-4" />
            {trend === "up" ? "+12%" : trend === "down" ? "-8%" : "0%"}
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      {loading ? (
        <Skeleton className="h-8 w-16 mt-2" />
      ) : (
        <p className="text-3xl font-bold mt-2">{value}</p>
      )}
      {subtext && <p className="text-xs text-muted-foreground mt-2">{subtext}</p>}
    </Card>
  );
}

function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [bedStats, setBedStats] = useState({ total: 0, occupied: 0, available: 0, maintenance: 0 });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [patientsData, bedsData, bedStatsData, paymentsData, notificationsData] = await Promise.all([
          getPatients(),
          getBeds(),
          getBedStatistics(),
          getPayments(),
          getNotifications(),
        ]);

        setPatients(patientsData);
        setBeds(bedsData);
        setBedStats(bedStatsData);
        setPayments(paymentsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;
  const recentPatients = patients.slice(0, 5);
  const recentPayments = payments.slice(0, 5);
  const recentNotifications = notifications.slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-2">Aperçu de votre activité clinique</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            icon={Users}
            label="Patients actifs"
            value={patients.length}
            subtext={`${recentPatients.length} récents`}
            loading={loading}
            trend="up"
          />
          <StatCard
            icon={BedDouble}
            label="Lits disponibles"
            value={bedStats.available}
            subtext={`${bedStats.total} total`}
            loading={loading}
            trend={bedStats.available > 5 ? "up" : "down"}
          />
          <StatCard
            icon={CreditCard}
            label="Revenu total"
            value={formatCurrency(totalRevenue)}
            subtext={`${payments.length} transactions`}
            loading={loading}
            trend="up"
          />
          <StatCard
            icon={Bell}
            label="Notifications"
            value={unreadNotifications}
            subtext={`${unreadNotifications} non lues`}
            loading={loading}
            trend={unreadNotifications > 0 ? "down" : "neutral"}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* Patients Section */}
          <Card className="border border-border/60">
            <div className="p-6 border-b border-border/60 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Patients récents
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/patients">Voir tout</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : recentPatients.length > 0 ? (
                    recentPatients.map((patient) => (
                      <TableRow key={patient._id}>
                        <TableCell className="font-medium">{patient.firstName} {patient.lastName}</TableCell>
                        <TableCell className="text-sm">{patient.email}</TableCell>
                        <TableCell className="text-sm">{patient.phone || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={patient.status === "active" ? "default" : "outline"}>
                            {patient.status || "Active"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                        Aucun patient
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Beds Section */}
          <Card className="border border-border/60">
            <div className="p-6 border-b border-border/60 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-green-600" />
                État des lits
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/beds">Voir tout</Link>
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-muted-foreground">Lits disponibles</p>
                  <p className="text-2xl font-bold text-green-700">{bedStats.available}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-muted-foreground">Occupés</p>
                  <p className="text-2xl font-bold text-red-700">{bedStats.occupied}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-muted-foreground">Maintenance</p>
                  <p className="text-2xl font-bold text-yellow-700">{bedStats.maintenance}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-blue-700">{bedStats.total}</p>
                </div>
              </div>
              {beds.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Derniers changements:</p>
                  <div className="space-y-2">
                    {beds.slice(0, 3).map((bed) => (
                      <div key={bed._id} className="flex items-center justify-between text-sm">
                        <span>Lit {bed.bedNumber} - Chambre {bed.roomNumber}</span>
                        <Badge variant={bed.isOccupied ? "destructive" : "outline"}>
                          {bed.isOccupied ? "Occupé" : "Disponible"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Payments Section */}
        <Card className="border border-border/60 mb-8">
          <div className="p-6 border-b border-border/60 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Paiements récents
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/payments">Voir tout</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Numéro de transaction</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : recentPayments.length > 0 ? (
                  recentPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell className="text-sm">{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(payment.amount, payment.currency)}</TableCell>
                      <TableCell className="text-sm capitalize">{payment.paymentMethod}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{payment.transactionId || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : payment.status === "pending"
                              ? "outline"
                              : "destructive"
                          }
                          className="flex w-fit items-center gap-1"
                        >
                          {payment.status === "completed" && <CheckCircle className="h-3 w-3" />}
                          {payment.status === "pending" && <Clock className="h-3 w-3" />}
                          {payment.status === "failed" && <AlertCircle className="h-3 w-3" />}
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                      Aucun paiement
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="border border-border/60">
          <div className="p-6 border-b border-border/60 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Notifications récentes
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/notifications">Voir tout</Link>
            </Button>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-60" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <div key={notification._id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full ${notification.isRead ? "bg-muted" : "bg-primary"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">
                        {notification.title || `Notification - ${notification.type}`}
                        {!notification.isRead && <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded">Nouvelle</span>}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(notification.sentAt)} • {notification.channel}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                Aucune notification
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
