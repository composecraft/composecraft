"use server"

import {ReactNode} from "react";
import ClientLayout from "@/app/dashboard/(dashboard)/clientLayout";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <ClientLayout version={process.env.NEXT_PUBLIC_VERSION || "1.0.0"}>
      {children}
    </ClientLayout>
  );
}
