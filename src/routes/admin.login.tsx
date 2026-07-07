import * as React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Espace salon — Hanny Tresse" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: any) => {
      if (data?.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Connexion impossible", { description: error.message });
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <section className="container mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14">
      <h1 className="font-sans font-bold text-3xl text-primary">Espace salon</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Réservé à l'équipe Hanny Tresse.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-primary font-semibold">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-primary font-semibold">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
        <p className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-secondary font-semibold">← Retour au site</Link>
        </p>
      </form>
    </section>
  );
}
