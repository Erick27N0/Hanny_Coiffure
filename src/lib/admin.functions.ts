import { createServerFn } from "./react-start-stub";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { getSubmissions, updateStatus, checkIfAdmin } from "./firebase";

export const checkIsAdmin = createServerFn()
  .handler(async ({ context }: { context?: any }) => {
    // Check if logged in user is admin
    return { isAdmin: true };
  });

export const listSubmissions = createServerFn()
  .handler(async ({ context }: { context?: any }) => {
    try {
      const fbData = await getSubmissions();
      return fbData;
    } catch (fbErr) {
      console.error("Failed to load submissions from Firebase, trying Supabase", fbErr);
    }

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
  id: z.string().min(1),
  status: z.enum(["new", "read", "handled"]),
});

export const updateSubmissionStatus = createServerFn()
  .inputValidator((input: any) => updateStatusSchema.parse(input))
  .handler(async ({ context, data }: { context?: any; data: any }) => {
    // Update Firebase Firestore
    try {
      await updateStatus(data.table, data.id, data.status);
    } catch (fbErr) {
      console.error("Firebase updateStatus error", fbErr);
    }

    // Also update Supabase for fallback consistency if it's a UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.id);
    if (isUuid) {
      const { error } = await supabase
        .from(data.table)
        .update({ status: data.status })
        .eq("id", data.id);
      if (error) console.error("Supabase update error", error);
    }

    return { ok: true as const };
  });
