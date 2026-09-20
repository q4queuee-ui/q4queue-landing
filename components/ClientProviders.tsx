"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-center" expand={false} richColors closeButton theme="light" />
    </AuthProvider>
  );
}
