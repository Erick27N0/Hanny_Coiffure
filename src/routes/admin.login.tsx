import * as React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle, checkIfAdmin, signOut } from "@/lib/firebase";
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
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = await checkIfAdmin(user.uid, user.email);
        if (isAdmin) {
          navigate({ to: "/admin" });
        } else {
          toast.error("Accès refusé", { description: "Ce compte n'a pas les droits d'administrateur." });
          await signOut();
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const isAdmin = await checkIfAdmin(user.uid, user.email);
      if (isAdmin) {
        toast.success("Connexion réussie");
        navigate({ to: "/admin" });
      } else {
        toast.error("Accès refusé", { description: "Ce compte n'a pas les droits d'administrateur." });
        await signOut();
      }
    } catch (error: any) {
      toast.error("Connexion impossible", { description: error.message || "Email ou mot de passe incorrect." });
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      const isAdmin = await checkIfAdmin(user.uid, user.email);
      if (isAdmin) {
        toast.success("Connexion avec Google réussie");
        navigate({ to: "/admin" });
      } else {
        toast.error("Accès refusé", { description: "Ce compte n'a pas les droits d'administrateur." });
        await signOut();
      }
    } catch (error: any) {
      toast.error("Connexion Google impossible", { description: error.message });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <section className="container mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14">
      <h1 className="font-sans font-bold text-3xl text-primary">Espace salon</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Réservé à l'équipe Hanny Tresse.
      </p>

      <div className="mt-8 space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold" disabled={loading || googleLoading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <span className="relative bg-card px-3 text-xs text-muted-foreground uppercase">Ou</span>
        </div>

        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-border flex items-center justify-center gap-2 font-bold" 
          onClick={onGoogleSignIn}
          disabled={loading || googleLoading}
        >
          <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          {googleLoading ? "Connexion Google..." : "Se connecter avec Google"}
        </Button>

        <p className="text-xs text-muted-foreground pt-2">
          <Link to="/" className="hover:text-secondary font-semibold">← Retour au site</Link>
        </p>
      </div>
    </section>
  );
}
