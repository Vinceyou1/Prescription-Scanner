"use client"
import "./globals.css";

import React from 'react';
import { AuthProvider } from "@/contexts/AuthContext";
import { UserDataProvider } from "@/contexts/UserDataContext";
import { MedicationDataProvider } from "@/contexts/MedicationDataContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en"
      className="h-full"
    >
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body
        // className={`${geist.variable} antialiased`}
        className="h-full"
      >
        <AuthProvider>
          <UserDataProvider>
            <MedicationDataProvider>
              {children}
            </MedicationDataProvider>
          </UserDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
