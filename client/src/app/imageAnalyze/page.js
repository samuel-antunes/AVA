"use client";

import Head from "next/head";
import ImageAnalyze from "@/components/ImageAnalyze";
import Camera from "@/components/Camera";
import Image from "next/image";

export default function imageAnalyze() {
  return (
    <div className="relative w-screen h-screen">
      <Image src={"/Arbic.svg"} priority alt="Image" width={220} height={220} className="absolute bottom-1/3 right-1/4 -mr-[80px] z-10"/>
      <Image src={"/French.svg"} alt="Image" width={220} height={220} className="absolute right-3/4 top-2/3 -mr-[40px] z-10"/>
      <Image src={"/Korean.svg"} alt="Image" width={220} height={220} className="absolute bottom-3/4 right-1/3 mb-[50px]" />
      <Image src={"/Persian.svg"} alt="Image" width={180} height={180} className="absolute left-1/4 top-1/3 ml-[150px]"/>
      <Image src={"/Portuguese.svg"} alt="Image" width={180} height={160} className="absolute top-1/3 left-3/4 transform -translate-y-1/2"/>
      <Image src={"/Spanish.svg"} alt="Image" width={200} height={200} className="absolute left-1/4 top-1/4 -ml-[100px] -mt-[50px]"/>
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