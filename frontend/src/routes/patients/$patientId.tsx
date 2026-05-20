import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getPatient, updatePatient, type Patient } from "../api/-clinic";

type ExtendedPatient = Patient & {
  medicalHistory?: string[];
  allergies?: string[];
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  isRegistered?: boolean;
  registrationDate?: string;
  lastConsultation?: string;
  bloodType?: string;
};

export const Route = createFileRoute("/patients/$patientId")({
  head: () => ({
    meta: [
      { title: "Détail Patient — Clinique Moulaye Dabakh" },
      { name: "description", content: "Consultez et modifiez les informations du patient." },
    ],
  }),
  component: PatientDetailPage,
  loader: async ({ params }) => {
    return { patientId: params.patientId };
  },
});

function PatientDetailPage() {
  const { patientId } = Route.useLoaderData();
  const [patient, setPatient] = useState<ExtendedPatient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState<Partial<ExtendedPatient>>({});

  useEffect(() => {
    const loadPatient = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPatient(patientId);
        if (data) {
          setPatient(data);
          setEditData(data);
        } else {
          setError("Patient non trouvé.");
        }
      } catch (err) {
        console.error("Erreur chargement patient:", err);
        setError("Impossible de charger les données du patient.");
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [patientId]);

  const handleSave = async () => {
    if (!patient) return;

    setSaving(true);
    try {
      const updatedPatient = await updatePatient(patientId, editData);
      setPatient(updatedPatient);
      setEditing(false);
      toast.success("Patient mis à jour avec succès.");
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(patient || {});
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium">Chargement du profil patient...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="p-10 text-center max-w-md w-full rounded-[2.5rem] shadow-xl border-none">
          <div className="h-20 w-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Erreur</h2>
          <p className="text-slate-500 mb-8">{error || "Patient non trouvé."}</p>
          <Button asChild variant="default" className="w-full rounded-2xl h-12">
            <Link to="/patients">Retour à la liste</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className=" min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/patients">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-muted-foreground">ID: {patient._id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={patient.status === "active" ? "default" : "secondary"}>
              {patient.status}
            </Badge>
            {!editing ? (
              <Button onClick={() => setEditing(true)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  {editing ? (
                    <Input
                      value={editData.firstName || ""}
                      onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{patient.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  {editing ? (
                    <Input
                      value={editData.lastName || ""}
                      onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{patient.lastName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  {editing ? (
                    <Input
                      type="email"
                      value={editData.email || ""}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {patient.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  {editing ? (
                    <Input
                      value={editData.phone || ""}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {patient.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Date de naissance</Label>
                  {editing ? (
                    <Input
                      type="date"
                      value={editData.dateOfBirth || ""}
                      onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {patient.dateOfBirth
                        ? new Date(patient.dateOfBirth).toLocaleDateString("fr-FR")
                        : "Non spécifiée"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Genre</Label>
                  {editing ? (
                    <Select
                      value={editData.gender || ""}
                      onValueChange={(value) => setEditData({ ...editData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Homme</SelectItem>
                        <SelectItem value="F">Femme</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-muted-foreground">{patient.gender}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Adresse */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Adresse
              </h2>
              {editing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Rue</Label>
                    <Input
                      value={editData.address?.street || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          address: { ...editData.address, street: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input
                      value={editData.address?.city || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          address: { ...editData.address, city: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Code postal</Label>
                    <Input
                      value={editData.address?.postalCode || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          address: { ...editData.address, postalCode: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pays</Label>
                    <Input
                      value={editData.address?.country || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          address: { ...editData.address, country: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {patient.address ? (
                    <>
                      <p>{patient.address.street}</p>
                      <p>
                        {patient.address.postalCode} {patient.address.city}
                      </p>
                      <p>{patient.address.country}</p>
                    </>
                  ) : (
                    <p>Adresse non spécifiée</p>
                  )}
                </div>
              )}
            </Card>

            {/* Historique médical */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Historique médical
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Groupe sanguin</Label>
                  {editing ? (
                    <Select
                      value={editData.bloodType || ""}
                      onValueChange={(value) => setEditData({ ...editData, bloodType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {patient.bloodType || "Non spécifié"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Antécédents médicaux</Label>
                  {editing ? (
                    <Textarea
                      value={(editData.medicalHistory || []).join(", ")}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          medicalHistory: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s),
                        })
                      }
                      placeholder="Séparez par des virgules"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                        patient.medicalHistory.map((condition, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucun antécédent médical</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Allergies</Label>
                  {editing ? (
                    <Textarea
                      value={(editData.allergies || []).join(", ")}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          allergies: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s),
                        })
                      }
                      placeholder="Séparez par des virgules"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies && patient.allergies.length > 0 ? (
                        patient.allergies.map((allergy, i) => (
                          <Badge key={i} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucune allergie connue</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact d'urgence */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Contact d'urgence
              </h2>
              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input
                      value={editData.emergencyContact?.name || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          emergencyContact: { ...editData.emergencyContact, name: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      value={editData.emergencyContact?.phone || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          emergencyContact: { ...editData.emergencyContact, phone: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lien</Label>
                    <Input
                      value={editData.emergencyContact?.relationship || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          emergencyContact: {
                            ...editData.emergencyContact,
                            relationship: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {patient.emergencyContact ? (
                    <>
                      <p className="font-medium">{patient.emergencyContact.name}</p>
                      <p>{patient.emergencyContact.phone}</p>
                      <p>{patient.emergencyContact.relationship}</p>
                    </>
                  ) : (
                    <p>Non spécifié</p>
                  )}
                </div>
              )}
            </Card>

            {/* Statistiques */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inscrit depuis</span>
                  <span>
                    {patient.registrationDate
                      ? new Date(patient.registrationDate).toLocaleDateString("fr-FR")
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dernière consultation</span>
                  <span>
                    {patient.lastConsultation
                      ? new Date(patient.lastConsultation).toLocaleDateString("fr-FR")
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                    {patient.status}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
