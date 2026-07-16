import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  getDoc,
  setDoc,
  DocumentData
} from "firebase/firestore";

// Config from firebase-applet-config.json
const firebaseConfig = {
  projectId: "notebooklm-automation-489617",
  appId: "1:204225533227:web:d4d5ca991e6790587d616e",
  apiKey: "AIzaSyDZh8aFAwvpRGZQqOxPSOMyk9PgdOzOIQ8",
  authDomain: "notebooklm-automation-489617.firebaseapp.com",
  databaseId: "ai-studio-hannytresse-8d4bd55a-a190-4338-9ae9-076168bb0b3c",
  storageBucket: "notebooklm-automation-489617.firebasestorage.app",
  messagingSenderId: "204225533227"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Sign-In Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Google Sign-In helper
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Auto-create user document in user_roles if not exists
    if (user.email) {
      const userRef = doc(db, "user_roles", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        // If it's the owner email, make them admin, otherwise user
        const role = user.email.toLowerCase() === "aboosowet@gmail.com" ? "admin" : "user";
        await setDoc(userRef, {
          email: user.email,
          role: role,
          displayName: user.displayName || "",
          createdAt: new Date().toISOString()
        });
      }
    }
    return user;
  } catch (error) {
    console.error("Error during Google Sign-in:", error);
    throw error;
  }
}

// Sign out helper
export async function signOut() {
  await fbSignOut(auth);
}

// Check if user has admin role
export async function checkIfAdmin(uid: string, email: string | null): Promise<boolean> {
  if (!uid) return false;
  
  // Explicit override for the requested user
  if (email && email.toLowerCase() === "aboosowet@gmail.com") {
    return true;
  }

  try {
    const userRef = doc(db, "user_roles", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().role === "admin";
    }
  } catch (error) {
    console.error("Error checking admin role:", error);
  }
  return false;
}

// Helper functions for submissions
export interface ContactMessage {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "handled";
}

export interface AppointmentRequest {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
  hairLength?: string;
  wigType?: string;
  createdAt: string;
  status: "new" | "read" | "handled";
}

export interface ProductInquiry {
  id?: string;
  productSlug: string;
  productName: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "handled";
}

export async function addContactMessage(data: Omit<ContactMessage, "status" | "createdAt">) {
  const colRef = collection(db, "contact_messages");
  return addDoc(colRef, {
    ...data,
    status: "new",
    createdAt: new Date().toISOString()
  });
}

export async function addAppointmentRequest(data: Omit<AppointmentRequest, "status" | "createdAt">) {
  const colRef = collection(db, "appointment_requests");
  return addDoc(colRef, {
    ...data,
    status: "new",
    createdAt: new Date().toISOString()
  });
}

export async function addProductInquiry(data: Omit<ProductInquiry, "status" | "createdAt">) {
  const colRef = collection(db, "product_inquiries");
  return addDoc(colRef, {
    ...data,
    status: "new",
    createdAt: new Date().toISOString()
  });
}

// Retrieve submissions
export async function getSubmissions() {
  const contactsQuery = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
  const appointmentsQuery = query(collection(db, "appointment_requests"), orderBy("createdAt", "desc"));
  const inquiriesQuery = query(collection(db, "product_inquiries"), orderBy("createdAt", "desc"));

  const [contactsSnap, appointmentsSnap, inquiriesSnap] = await Promise.all([
    getDocs(contactsQuery),
    getDocs(appointmentsQuery),
    getDocs(inquiriesQuery)
  ]);

  const contacts = contactsSnap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      full_name: data.fullName || data.full_name || "",
      created_at: data.createdAt || data.created_at || new Date().toISOString(),
      status: data.status || "new",
      phone: data.phone || "",
      email: data.email || "",
      subject: data.subject || "",
      message: data.message || "",
    };
  });

  const appointments = appointmentsSnap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      full_name: data.fullName || data.full_name || "",
      created_at: data.createdAt || data.created_at || new Date().toISOString(),
      status: data.status || "new",
      phone: data.phone || "",
      email: data.email || "",
      situation: data.situation || "",
      oncology_center: data.oncologyCenter || data.oncology_center || "",
      preferred_slot: data.preferredSlot || data.preferred_slot || "",
    };
  });

  const inquiries = inquiriesSnap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      product_slug: data.productSlug || data.product_slug || "",
      product_name: data.productName || data.product_name || "",
      full_name: data.fullName || data.full_name || "",
      created_at: data.createdAt || data.created_at || new Date().toISOString(),
      status: data.status || "new",
      phone: data.phone || "",
      email: data.email || "",
      message: data.message || "",
    };
  });

  return { contacts, appointments, inquiries };
}

// Update status
export async function updateStatus(collectionName: "contact_messages" | "appointment_requests" | "product_inquiries", id: string, status: "new" | "read" | "handled") {
  const docRef = doc(db, collectionName, id);
  return updateDoc(docRef, { status });
}
