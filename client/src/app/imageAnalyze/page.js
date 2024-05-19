"use client";

import Head from "next/head";
import ImageAnalyze from "@/components/ImageAnalyze";
import Camera from "@/components/Camera";
import Image from "next/image";

export default function imageAnalyze() {
  return (
    <div className="relative w-screen h-screen">
      <Image src={"/Arbic.svg"} priority alt="Image" width={220} height={220} className="hidden md:absolute md:bottom-1/3 md:right-1/4 md:-mr-[80px] md:z-10"/>
      <Image src={"/French.svg"} alt="Image" width={220} height={220} className="hidden md:absolute md:right-3/4 md:top-2/3 md:-mr-[40px] md:z-10"/>
      <Image src={"/Korean.svg"} alt="Image" width={220} height={220} className="hidden md:absolute md:bottom-3/4 md:right-1/3 md:mb-[50px]" />
      <Image src={"/Persian.svg"} alt="Image" width={180} height={180} className="hidden md:absolute md:left-1/4 md:top-1/3 md:ml-[150px]"/>
      <Image src={"/Portuguese.svg"} alt="Image" width={180} height={160} className="hidden md:absolute md:top-1/3 md:left-3/4 md:transform md:-translate-y-1/2"/>
      <Image src={"/Spanish.svg"} alt="Image" width={200} height={200} className="hidden md:absolute md:left-1/4 md:top-1/4 md:-ml-[100px] md:-mt-[50px]"/>
    </div>
  );
}
{/* <div>
<Head>
  <title>AVA</title>
  <link rel="icon" href="/favicon.ico" />
</Head>

<main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
  <h1 className="text-3xl font-bold mb-8">Chat with AVA</h1>
  <ImageAnalyze />
  <Camera />
</main>
</div> */}