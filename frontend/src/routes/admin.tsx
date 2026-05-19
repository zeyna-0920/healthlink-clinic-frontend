import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  LogOut,
  Shield,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPatients,
  getAppointments,
  getPayments,
  getNotifications,
  updateAppointmentStatus,
  sendAppointmentReminders,
  type Patient,
  type Appointment,
  type Payment,
  type Notification,
} from "./api/-clinic";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content: "Espace d'administration de la clinique.",
      },
    ],
  }),
  component: AdminPage,
});

// Configuration admin
const ADMIN_CREDENTIALS = {
  email: "dienebat782@gmail.com",
  password: "T2000@1970",
};

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

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  // États des données
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Vérifier si déjà authentifié
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [patientsData, appointmentsData, paymentsData, notificationsData] = await Promise.all([
        getPatients(),
        getAppointments(),
        getPayments(),
        getNotifications(),
      ]);

      setPatients(patientsData);
      setAppointments(appointmentsData);
      setPayments(paymentsData);
      setNotifications(notificationsData);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    if (
      loginData.email === ADMIN_CREDENTIALS.email &&
      loginData.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuthenticated", "true");
      toast.success("Connexion réussie");
      await loadData();
    } else {
      toast.error("Email ou mot de passe incorrect");
    }

    setLoginLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
    setLoginData({ email: "", password: "" });
    toast.success("Déconnexion réussie");
    // @ts-ignore
    navigate({ to: "/admin" });
  };

  const handleStatusChange = async (appointmentId: string, status: Appointment["status"]) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      setAppointments(
        appointments.map((apt) => (apt._id === appointmentId ? { ...apt, status } : apt)),
      );
      toast.success("Statut mis à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleSendReminders = async () => {
    try {
      const result = (await sendAppointmentReminders()) as {
        success: boolean;
        message: string;
      };
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error("Erreur lors de l'envoi des rappels");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
    }
  };

  // Statistiques
  const stats = {
    totalPatients: patients.length,
    activePatients: patients.filter((p) => p.status === "active").length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter((a) => a.status === "scheduled").length,
    completedAppointments: appointments.filter((a) => a.status === "completed").length,
    totalPayments: payments.reduce((sum, p) => sum + p.amount, 0),
    completedPayments: payments.filter((p) => p.status === "completed").length,
    unreadNotifications: notifications.filter((n) => !n.isRead).length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-2xl font-bold">Administration</h1>
            <p className="text-muted-foreground">Clinique Moulaye Dabakh</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loginLoading}>
              {loginLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
              <p className="text-sm text-gray-600">Clinique Moulaye Dabakh</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleSendReminders} className="gap-2">
                <Bell className="h-4 w-4" />
                Envoyer rappels (24h)
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Patients actifs</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.activePatients}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rendez-vous en attente</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.pendingAppointments}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paiements reçus</p>
                <p className="text-2xl font-bold">
                  {loading ? "..." : formatCurrency(stats.totalPayments)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Notifications non lues</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.unreadNotifications}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Rendez-vous récents */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Rendez-vous récents</h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.slice(0, 10).map((appointment) => {
                    const patient = patients.find((p) => p._id === appointment.patientId);
                    return (
                      <TableRow key={appointment._id}>
                        <TableCell>
                          {patient ? `${patient.firstName} ${patient.lastName}` : "Patient inconnu"}
                        </TableCell>
                        <TableCell>
                          {formatDate(appointment.appointmentDate)} à {appointment.appointmentTime}
                        </TableCell>
                        <TableCell>{appointment.department}</TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              appointment.status === "completed"
                                ? "default"
                                : appointment.status === "confirmed"
                                  ? "secondary"
                                  : appointment.status === "cancelled"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {appointment.status === "scheduled"
                              ? "Programmé"
                              : appointment.status === "confirmed"
                                ? "Confirmé"
                                : appointment.status === "completed"
                                  ? "Terminé"
                                  : appointment.status === "cancelled"
                                    ? "Annulé"
                                    : "Absent"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {appointment.status === "scheduled" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusChange(appointment._id, "confirmed")}
                                >
                                  Confirmer
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleStatusChange(appointment._id, "cancelled")}
                                >
                                  Refuser
                                </Button>
                              </>
                            )}
                            {appointment.status === "confirmed" && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(appointment._id, "completed")}
                              >
                                Terminer
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>

        {/* Paiements récents */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Paiements récents</h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.slice(0, 10).map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                          {payment.status === "completed" ? "Réussi" : "En attente"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell>{payment.description || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>

        {/* Patients actifs */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Patients actifs</h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients
                    .filter((p) => p.status === "active")
                    .slice(0, 10)
                    .map((patient) => (
                      <TableRow key={patient._id}>
                        <TableCell className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>{formatDate((patient as any).createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant="default">Actif</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
