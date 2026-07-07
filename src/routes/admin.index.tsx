import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  listSubmissions,
  updateSubmissionStatus,
  checkIsAdmin,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Hanny Tresse" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Status = "new" | "read" | "handled";
const statusLabel: Record<Status, string> = {
  new: "Nouveau",
  read: "Lu",
  handled: "Traité",
};

function StatusBadge({ status }: { status: Status }) {
  const variant =
    status === "new" ? "default" : status === "read" ? "secondary" : "outline";
  return <Badge variant={variant as "default" | "secondary" | "outline"}>{statusLabel[status]}</Badge>;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const checkAdmin = useServerFn(checkIsAdmin);
  const fetchList = useServerFn(listSubmissions);
  const updateStatus = useServerFn(updateSubmissionStatus);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }: any) => {
      if (!mounted) return;
      if (!data?.session) {
        navigate({ to: "/admin/login" });
        return;
      }
      try {
        const res = await checkAdmin();
        if (!res.isAdmin) {
          toast.error("Accès refusé", { description: "Ce compte n'a pas les droits administrateur." });
          await supabase.auth.signOut();
          navigate({ to: "/admin/login" });
          return;
        }
        setReady(true);
      } catch {
        navigate({ to: "/admin/login" });
      }
    });
    return () => {
      mounted = false;
    };
  }, [navigate, checkAdmin]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: () => fetchList(),
    enabled: ready,
  });

  const onUpdateStatus = async (
    table: "contact_messages" | "appointment_requests" | "product_inquiries",
    id: string,
    status: Status
  ) => {
    try {
      await updateStatus({ data: { table, id, status } });
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success("Statut mis à jour");
    } catch (err) {
      toast.error("Erreur", { description: err instanceof Error ? err.message : "" });
    }
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (!ready) {
    return (
      <section className="container mx-auto px-4 py-20 text-center text-muted-foreground font-semibold">
        Chargement…
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Espace salon</p>
          <h1 className="mt-2 font-sans font-bold text-3xl text-primary">Demandes reçues</h1>
        </div>
        <Button variant="outline" onClick={onLogout}>Se déconnecter</Button>
      </div>

      {isLoading || !data ? (
        <p className="mt-10 text-muted-foreground font-medium">Chargement des demandes…</p>
      ) : (
        <Tabs defaultValue="appointments" className="mt-8">
          <TabsList className="bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="appointments">
              Perruques ({data.appointments.length})
            </TabsTrigger>
            <TabsTrigger value="inquiries">
              Boutique ({data.inquiries.length})
            </TabsTrigger>
            <TabsTrigger value="contacts">
              Contact ({data.contacts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="mt-6 space-y-3">
            {data.appointments.length === 0 && <Empty />}
            {data.appointments.map((r: any) => (
              <AdminCard
                key={r.id}
                title={r.full_name}
                subtitle={`${fmtDate(r.created_at)} · ${r.email} · ${r.phone}`}
                status={r.status as Status}
                onStatusChange={(s) => onUpdateStatus("appointment_requests", r.id, s)}
              >
                <p className="text-sm font-medium leading-relaxed">{r.situation}</p>
                {r.oncology_center && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Centre : {r.oncology_center}
                  </p>
                )}
                {r.preferred_slot && (
                  <p className="text-xs text-muted-foreground">Créneau : {r.preferred_slot}</p>
                )}
              </AdminCard>
            ))}
          </TabsContent>

          <TabsContent value="inquiries" className="mt-6 space-y-3">
            {data.inquiries.length === 0 && <Empty />}
            {data.inquiries.map((r: any) => (
              <AdminCard
                key={r.id}
                title={`${r.product_name} — ${r.full_name}`}
                subtitle={`${fmtDate(r.created_at)} · ${r.email} · ${r.phone}`}
                status={r.status as Status}
                onStatusChange={(s) => onUpdateStatus("product_inquiries", r.id, s)}
              >
                {r.message && <p className="text-sm font-medium leading-relaxed">{r.message}</p>}
              </AdminCard>
            ))}
          </TabsContent>

          <TabsContent value="contacts" className="mt-6 space-y-3">
            {data.contacts.length === 0 && <Empty />}
            {data.contacts.map((r: any) => (
              <AdminCard
                key={r.id}
                title={`${r.full_name}${r.subject ? ` — ${r.subject}` : ""}`}
                subtitle={`${fmtDate(r.created_at)} · ${r.email}${r.phone ? ` · ${r.phone}` : ""}`}
                status={r.status as Status}
                onStatusChange={(s) => onUpdateStatus("contact_messages", r.id, s)}
              >
                <p className="text-sm whitespace-pre-wrap font-medium leading-relaxed">{r.message}</p>
              </AdminCard>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </section>
  );
}

function Empty() {
  return (
    <p className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground font-medium shadow-sm">
      Aucune demande pour le moment.
    </p>
  );
}

function AdminCard({
  title,
  subtitle,
  status,
  onStatusChange,
  children,
}: {
  title: string;
  subtitle: string;
  status: Status;
  onStatusChange: (s: Status) => void;
  children: React.ReactNode;
  key?: any;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold text-primary">{title}</p>
          <p className="text-xs text-muted-foreground font-semibold">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <Select value={status} onValueChange={(v) => onStatusChange(v as Status)}>
            <SelectTrigger className="h-8 w-[120px] text-xs font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Nouveau</SelectItem>
              <SelectItem value="read">Lu</SelectItem>
              <SelectItem value="handled">Traité</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-3 text-slate-700">{children}</div>
    </div>
  );
}
