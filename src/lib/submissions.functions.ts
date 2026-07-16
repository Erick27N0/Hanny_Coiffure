import { createServerFn } from "./react-start-stub";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { addContactMessage, addAppointmentRequest, addProductInquiry } from "./firebase";

const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
});

export const submitContact = createServerFn()
  .inputValidator((input: any) => contactSchema.parse(input))
  .handler(async ({ data }: { data: any }) => {
    // Write to Firebase Firestore first
    try {
      await addContactMessage({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || "",
        subject: data.subject || "",
        message: data.message,
      });
    } catch (fbErr) {
      console.error("Firebase submitContact error", fbErr);
    }

    const { error } = await supabase.from("contact_messages").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    });
    if (error) {
      console.error("submitContact error", error);
      throw new Error("Impossible d'enregistrer le message. Réessayez plus tard.");
    }
    return { ok: true as const };
  });

const appointmentSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone requis").max(30),
  situation: z.string().trim().min(5, "Précisez votre situation").max(1000),
  oncologyCenter: z.string().trim().max(200).optional().or(z.literal("")),
  preferredSlot: z.string().trim().max(200).optional().or(z.literal("")),
});

export const submitAppointment = createServerFn()
  .inputValidator((input: any) => appointmentSchema.parse(input))
  .handler(async ({ data }: { data: any }) => {
    // Write to Firebase Firestore first
    try {
      await addAppointmentRequest({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        situation: data.situation,
        oncologyCenter: data.oncologyCenter || "",
        preferredSlot: data.preferredSlot || "",
      } as any);
    } catch (fbErr) {
      console.error("Firebase submitAppointment error", fbErr);
    }

    const { error } = await supabase.from("appointment_requests").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      situation: data.situation,
      oncology_center: data.oncologyCenter || null,
      preferred_slot: data.preferredSlot || null,
    });
    if (error) {
      console.error("submitAppointment error", error);
      throw new Error("Impossible d'enregistrer la demande. Réessayez plus tard.");
    }
    return { ok: true as const };
  });

const productInquirySchema = z.object({
  productSlug: z.string().trim().min(1).max(200),
  productName: z.string().trim().min(1).max(200),
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const submitProductInquiry = createServerFn()
  .inputValidator((input: any) => productInquirySchema.parse(input))
  .handler(async ({ data }: { data: any }) => {
    // Write to Firebase Firestore first
    try {
      await addProductInquiry({
        productSlug: data.productSlug,
        productName: data.productName,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        message: data.message || "",
      });
    } catch (fbErr) {
      console.error("Firebase submitProductInquiry error", fbErr);
    }

    const { error } = await supabase.from("product_inquiries").insert({
      product_slug: data.productSlug,
      product_name: data.productName,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      message: data.message || null,
    });
    if (error) {
      console.error("submitProductInquiry error", error);
      throw new Error("Impossible d'enregistrer la demande. Réessayez plus tard.");
    }
    return { ok: true as const };
  });
