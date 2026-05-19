import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  Users,
  BedDouble,
  CreditCard,
  Bell,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Calendar,
  Search,
  ArrowRight,
  MoreVertical,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Stethoscope,
  ClipboardList,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
} from "recharts";
import {
  getPatients,
  getBeds,
  getBedStatistics,
  getPayments,
  getNotifications,
  getAppointments,
  type Patient,
  type Bed,
  type Payment,
  type Notification,
  type Appointment,
} from "./api/-clinic";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de Bord — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content: "Gestion clinique et statistiques en temps réel.",
      },
    ],
  }),
  component: DashboardPage,
});

// Mock data for charts
const patientGrowthData = [
  { month: "Jan", count: 45 },
  { month: "Feb", count: 52 },
  { month: "Mar", count: 48 },
  { month: "Apr", count: 61 },
  { month: "May", count: 55 },
  { month: "Jun", count: 67 },
  { month: "Jul", count: 72 },
];

const revenueData = [
  { day: "Lun", amount: 125000 },
  { day: "Mar", amount: 150000 },
  { day: "Mer", amount: 110000 },
  { day: "Jeu", amount: 190000 },
  { day: "Ven", amount: 210000 },
  { day: "Sam", amount: 180000 },
  { day: "Dim", amount: 95000 },
];

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number, currency: string = "XOF") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  loading?: boolean;
  trend?: number;
  color?: "primary" | "success" | "warning" | "destructive" | "info";
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  loading,
  trend,
  color = "primary",
}: StatCardProps) {
  const gradients = {
    primary: "from-blue-600 to-indigo-700 shadow-blue-500/20",
    success: "from-emerald-500 to-teal-700 shadow-emerald-500/20",
    warning: "from-orange-500 to-amber-600 shadow-orange-500/20",
    destructive: "from-rose-500 to-red-700 shadow-rose-500/20",
    info: "from-sky-500 to-blue-700 shadow-sky-500/20",
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-none text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br",
        gradients[color],
      )}
    >
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="rounded-2xl bg-white/20 backdrop-blur-md p-3 shadow-inner">
            <Icon className="h-6 w-6 text-white" />
          </div>
          {trend !== undefined && (
            <div className="flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white">
              {trend > 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="mt-5">
          <p className="text-sm font-medium text-white/80 uppercase tracking-wider">{label}</p>
          {loading ? (
            <Skeleton className="h-9 w-24 mt-2 bg-white/20" />
          ) : (
            <h3 className="text-3xl font-black tracking-tight mt-1">{value}</h3>
          )}
          {subtext && <p className="text-xs text-white/70 mt-2 font-medium">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [bedStats, setBedStats] = useState({ total: 0, occupied: 0, available: 0, maintenance: 0 });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérification de l'accès administrateur
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth !== "true") {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setIsAdmin(true);

    const loadData = async () => {
      setLoading(true);
      try {
        const [
          patientsData,
          bedsData,
          bedStatsData,
          paymentsData,
          notificationsData,
          appointmentsData,
        ] = await Promise.all([
          getPatients(),
          getBeds(),
          getBedStatistics(),
          getPayments(),
          getNotifications(),
          getAppointments(),
        ]);

        setPatients(patientsData);
        setBeds(bedsData);
        setBedStats(bedStatsData);
        setPayments(paymentsData);
        setNotifications(notificationsData);
        setAppointments(appointmentsData);
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
  const recentNotifications = notifications.slice(0, 5);
  const recentAppointments = appointments.slice(0, 5);

  const activityFeed = useMemo(() => {
    const combined = [
      ...notifications.map((n) => ({ ...n, activityType: "notification" })),
      ...appointments.map((a) => ({ ...a, activityType: "appointment" })),
    ];
    return combined
      .sort((a, b) => {
        const dateA = new Date("sentAt" in a ? a.sentAt : a.createdAt).getTime();
        const dateB = new Date("sentAt" in b ? b.sentAt : b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 10);
  }, [notifications, appointments]);

  const bedOccupancyRate =
    bedStats.total > 0 ? Math.round((bedStats.occupied / bedStats.total) * 100) : 0;

  const bedChartData = useMemo(
    () =>
      [
        { name: "Occupés", value: bedStats.occupied, color: "hsl(var(--destructive))" },
        { name: "Disponibles", value: bedStats.available, color: "hsl(var(--primary))" },
        { name: "Maintenance", value: bedStats.maintenance, color: "hsl(var(--muted-foreground))" },
      ].filter((d) => d.value > 0),
    [bedStats],
  );

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-border/40 max-w-md w-full">
          <div className="h-20 w-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Accès Réservé</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Désolé, seul l'administrateur de la clinique peut accéder au tableau de bord et
            consulter les données des patients.
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with Welcome and Actions */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <span className="bg-primary/10 p-2 rounded-lg">
                <Stethoscope className="h-8 w-8 text-primary" />
              </span>
              Tableau de Bord
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button className="rounded-xl shadow-sm gap-2" size="sm" asChild>
              <Link to="/patients/new">
                <Plus className="h-4 w-4" />
                Nouveau Patient
              </Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-xl shadow-sm gap-2 bg-white"
              size="sm"
              asChild
            >
              <Link to="/rendez-vous">
                <Calendar className="h-4 w-4" />
                Programmer RDV
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl relative" asChild>
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive" />
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Top Statistics Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <StatCard
            icon={Users}
            label="Patients Totaux"
            value={patients.length}
            subtext={`${recentPatients.length} cette semaine`}
            loading={loading}
            trend={12}
            color="primary"
          />
          <StatCard
            icon={Activity}
            label="Taux d'Occupation"
            value={`${bedOccupancyRate}%`}
            subtext={`${bedStats.occupied} lits occupés`}
            loading={loading}
            trend={-5}
            color="success"
          />
          <StatCard
            icon={CreditCard}
            label="Revenu (Mensuel)"
            value={formatCurrency(totalRevenue)}
            subtext="Paiements validés"
            loading={loading}
            trend={8}
            color="info"
          />
          <StatCard
            icon={Bell}
            label="Notifications"
            value={unreadNotifications}
            subtext="Alertes non lues"
            loading={loading}
            color="warning"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue Chart */}
            <Card className="border-border/40 shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div>
                  <CardTitle className="text-lg font-bold">Aperçu des Revenus</CardTitle>
                  <CardDescription>Performance financière de la semaine</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-semibold">
                    Hebdomadaire
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--muted))"
                      />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        tickFormatter={(value) => `${value / 1000}k`}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-muted-foreground">
                                      Revenu
                                    </span>
                                    <span className="font-bold text-muted-foreground">
                                      {formatCurrency(payload[0].value as number)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Patients Table */}
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Patients Récents</CardTitle>
                  <CardDescription>Dernières admissions et consultations</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="gap-2">
                  <Link to="/patients">
                    Voir tout <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[200px]">Patient</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead className="text-right">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      [1, 2, 3].map((i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-10 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-16 ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : recentPatients.length > 0 ? (
                      recentPatients.map((patient) => (
                        <TableRow key={patient._id} className="group cursor-pointer">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                {patient.firstName?.[0] || ""}
                                {patient.lastName?.[0] || ""}
                              </div>
                              <div className="font-medium truncate max-w-[150px]">
                                {patient.firstName} {patient.lastName}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">{patient.email}</TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {patient.phone || "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={patient.status === "active" ? "default" : "outline"}
                              className="rounded-lg font-medium"
                            >
                              {patient.status || "Active"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                          Aucun patient trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Bed Occupancy Pie Chart */}
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Disponibilité des Lits</CardTitle>
                <CardDescription>Occupation en temps réel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bedChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {bedChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                      Occupés
                    </p>
                    <p className="text-xl font-bold text-destructive">{bedStats.occupied}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                      Libres
                    </p>
                    <p className="text-xl font-bold text-primary">{bedStats.available}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-6 rounded-xl" asChild>
                  <Link to="/beds">Gérer les lits</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/40 shadow-sm bg-slate-900 text-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button
                  variant="secondary"
                  className="justify-start gap-3 h-12 rounded-xl bg-white/10 border-white/10 text-white hover:bg-white/20"
                >
                  <ClipboardList className="h-5 w-5" />
                  Nouvelle Prescription
                </Button>
                <Button
                  variant="secondary"
                  className="justify-start gap-3 h-12 rounded-xl bg-white/10 border-white/10 text-white hover:bg-white/20"
                >
                  <Activity className="h-5 w-5" />
                  Bilan de Santé
                </Button>
                <Button
                  variant="secondary"
                  className="justify-start gap-3 h-12 rounded-xl bg-white/10 border-white/10 text-white hover:bg-white/20"
                >
                  <Search className="h-5 w-5" />
                  Dossier Patient
                </Button>
              </CardContent>
            </Card>

            {/* Recent Notifications Feed */}
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Flux d'Activité</CardTitle>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {unreadNotifications} Alertes
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <div key={i} className="p-4 flex gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    ))
                  ) : activityFeed.length > 0 ? (
                    activityFeed.map((item) => {
                      const isNotification =
                        "activityType" in item &&
                        item.activityType === "notification";
                      const id =
                        "_id" in item
                          ? (item._id as string)
                          : (item as Record<string, any>).id;
                      const date =
                        "sentAt" in item
                          ? (item.sentAt as string)
                          : (item as Record<string, any>).createdAt;
                      const title =
                        "title" in item
                          ? (item.title as string)
                          : isNotification
                            ? (item as Record<string, any>).type
                            : `RDV: ${(item as Record<string, any>).reason}`;
                      const message =
                        "message" in item
                          ? (item.message as string)
                          : `Département: ${(item as Record<string, any>).department}`;

                      return (
                        <div
                          key={id}
                          className="group flex gap-3 p-4 transition-colors hover:bg-slate-50"
                        >
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                              isNotification &&
                                !(item as Record<string, any>).isRead
                                ? "bg-blue-100 text-blue-600"
                                : "bg-slate-100 text-slate-400",
                            )}
                          >
                            {!isNotification ? (
                              <Calendar className="h-4 w-4" />
                            ) : (
                              <Bell className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p
                              className={cn(
                                "truncate text-sm",
                                isNotification &&
                                  !(item as Record<string, any>).isRead
                                  ? "font-semibold text-slate-900"
                                  : "text-slate-500",
                              )}
                            >
                              {title}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {message}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-400">
                              {formatDate(date)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-sm">
                      Aucune activité récente
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  className="w-full rounded-none border-t text-xs h-10 text-slate-500 hover:text-primary"
                  asChild
                >
                  <Link to="/notifications">Voir tout l'historique</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payments Section Full Width */}
        <div className="mt-10">
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Flux Financier</CardTitle>
                <CardDescription>Transactions et règlements récents</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="rounded-xl">
                <Link to="/payments">Gérer la facturation</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Date</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead className="text-right">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : recentPayments.length > 0 ? (
                    recentPayments.map((payment) => (
                      <TableRow key={payment._id}>
                        <TableCell className="text-sm font-medium">
                          {formatDate(payment.paymentDate)}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500 font-mono uppercase">
                          {payment.transactionId?.slice(-8) || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="rounded-lg capitalize text-[10px] font-bold tracking-wider"
                          >
                            {payment.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={cn(
                              "rounded-lg px-2.5 py-0.5",
                              payment.status === "completed"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-700 hover:bg-red-100",
                            )}
                          >
                            {payment.status === "completed"
                              ? "Validé"
                              : payment.status === "pending"
                                ? "En attente"
                                : "Échoué"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                        Aucune transaction récente
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
