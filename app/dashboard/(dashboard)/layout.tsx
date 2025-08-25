"use server"

import {ReactNode} from "react";
import ClientLayout from "@/app/dashboard/(dashboard)/clientLayout";
import getConfig from "next/config";

export default async function Layout({ children }: { children: ReactNode }) {
  const { publicRuntimeConfig } = getConfig();

  return (
    <ClientLayout version={publicRuntimeConfig?.version}>
      {children}
    </ClientLayout>
  );
}