"use client";

import Head from "next/head";
import ImageAnalyze from "@/components/ImageAnalyze";

export default function imageAnalyze() {
  return (
    <div>
      <Head>
        <title>AVA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-8">Chat with AVA</h1>
        <ImageAnalyze />
      </main>
    </div>
  );
}