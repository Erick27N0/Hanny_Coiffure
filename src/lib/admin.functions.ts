import { createServerFn } from "./react-start-stub";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const checkIsAdmin = createServerFn()
  .handler(async ({ context }: { context?: any }) => {
    // Check role in user_roles table or return true for mock admin login
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context?.userId || "mock-admin-id")
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data || context?.userId === "mock-admin-id" };
  });

export const listSubmissions = createServerFn()
  .handler(async ({ context }: { context?: any }) => {
    const [contacts, appointments, inquiries] = await Promise.all([
      supabase
        .from("contact_messages")
        .select("*")
        .order("created_at")
        .limit(200),
      supabase
        .from("appointment_requests")
        .select("*")
        .order("created_at")
        .limit(200),
      supabase
        .from("product_inquiries")
        .select("*")
        .order("created_at")
        .limit(200),
    ]);
    if (contacts.error || appointments.error || inquiries.error) {
      throw new Error("Erreur de chargement des demandes");
    }
    return {
      contacts: contacts.data ?? [],
      appointments: appointments.data ?? [],
      inquiries: inquiries.data ?? [],
    };
  });

const updateStatusSchema = z.object({
  table: z.enum(["contact_messages", "appointment_requests", "product_inquiries"]),
  id: z.string().uuid(),
  status: z.enum(["new", "read", "handled"]),
});

export const updateSubmissionStatus = createServerFn()
  .inputValidator((input: any) => updateStatusSchema.parse(input))
  .handler(async ({ context, data }: { context?: any; data: any }) => {
    const { error } = await supabase
      .from(data.table)
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error("Mise à jour impossible");
    return { ok: true as const };
  });
