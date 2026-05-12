import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Save, User, Mail, Phone, Calendar, MapPin, Heart, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createPatient } from "../api/-clinic";

export const Route = createFileRoute("/patients/new")({
  head: () => ({
    meta: [
      { title: "Nouveau Patient — Clinique Moulaye Dabakh" },
      { name: "description", content: "Créer un nouveau dossier patient." },
    ],
  }),
  component: NewPatientPage,
});

function NewPatientPage() {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
    bloodType: "",
    medicalHistory: [] as string[],
    allergies: [] as string[],
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setSaving(true);
    try {
      await createPatient(formData);
      toast.success("Patient créé avec succès !");
      // Redirection vers la liste des patients
      window.location.href = "/patients";
    } catch (error) {
      console.error("Erreur création patient:", error);
      toast.error("Erreur lors de la création du patient.");
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const updateEmergencyContact = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value }
    }));
  };

  return (
    <div className="bg-[image:var(--gradient-soft)] min-h-screen">
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
              <h1 className="text-3xl font-bold">Nouveau Patient</h1>
              <p className="text-muted-foreground">Créer un nouveau dossier patient</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
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
                    <Label>Prénom *</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone *</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de naissance</Label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Genre</Label>
                    <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculin</SelectItem>
                        <SelectItem value="F">Féminin</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Adresse */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adresse
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Rue</Label>
                    <Input
                      value={formData.address.street}
                      onChange={(e) => updateAddress("street", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input
                      value={formData.address.city}
                      onChange={(e) => updateAddress("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Code postal</Label>
                    <Input
                      value={formData.address.postalCode}
                      onChange={(e) => updateAddress("postalCode", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pays</Label>
                    <Input
                      value={formData.address.country}
                      onChange={(e) => updateAddress("country", e.target.value)}
                      placeholder="Sénégal"
                    />
                  </div>
                </div>
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
                    <Select value={formData.bloodType} onValueChange={(value) => updateFormData("bloodType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
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
                  </div>
                  <div className="space-y-2">
                    <Label>Allergies</Label>
                    <Textarea
                      value={formData.allergies.join(", ")}
                      onChange={(e) => updateFormData("allergies", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                      placeholder="Séparer par des virgules"
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Label>Historique médical</Label>
                  <Textarea
                    value={formData.medicalHistory.join(", ")}
                    onChange={(e) => updateFormData("medicalHistory", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                    placeholder="Séparer par des virgules"
                  />
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input
                      value={formData.emergencyContact.name}
                      onChange={(e) => updateEmergencyContact("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      value={formData.emergencyContact.phone}
                      onChange={(e) => updateEmergencyContact("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lien</Label>
                    <Input
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => updateEmergencyContact("relationship", e.target.value)}
                      placeholder="Ex: Épouse, Frère..."
                    />
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-6">
                <div className="space-y-4">
                  <Button type="submit" className="w-full" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Création..." : "Créer le patient"}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/patients">Annuler</Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  * Champs obligatoires
                </p>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}