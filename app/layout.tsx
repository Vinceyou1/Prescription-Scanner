"use client"
import "./globals.css";

import React from 'react';

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json"
import { UserProvider } from "@/contexts/UserContext";
import { DataProvider } from "@/contexts/DataContext";

Amplify.configure(outputs)

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
        <UserProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </UserProvider>
      </body>
    </html>
  );
}
