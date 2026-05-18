import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2, Inbox, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNotifications, type Notification } from "./api/-clinic";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Clinique Moulaye Dabakh" },
      { name: "description", content: "Suivi des notifications patients et rappels importants." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getNotifications();
        if (!cancelled) {
          setNotifications(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Impossible de charger les notifications.");
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

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-medical font-semibold mb-3">
              Notifications
            </p>
            <h1 className="text-4xl font-bold">Notifications</h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Consulter les rappels, confirmations et alertes envoyées aux patients.
            </p>
          </div>
          <Badge variant={unreadCount > 0 ? "destructive" : "default"}>{unreadCount} non lus</Badge>
        </div>

        {loading ? (
          <Card className="p-10 text-center text-muted-foreground">
            Chargement des notifications…
          </Card>
        ) : error ? (
          <Card className="p-10 text-center text-destructive">{error}</Card>
        ) : notifications.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">
            Aucune notification pour le moment.
          </Card>
        ) : (
          <div className="grid gap-4">
            {notifications.map((notification) => (
              <Card key={notification._id} className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-primary">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">
                        {notification.title || notification.type}
                      </h2>
                      <p className="text-sm text-muted-foreground">{notification.channel}</p>
                    </div>
                  </div>
                  <Badge variant={notification.isRead ? "secondary" : "destructive"}>
                    {notification.isRead ? "Lu" : "Non lu"}
                  </Badge>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{notification.message}</p>
                <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  Envoyé le {new Date(notification.sentAt).toLocaleDateString("fr-FR")}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
