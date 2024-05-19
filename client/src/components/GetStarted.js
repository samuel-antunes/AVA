"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const GetStarted = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/chat");
  };

  return (
    <>
      <div className="absolute w-screen h-screen">
        <Image
          src={"/Arbic.svg"}
          priority
          alt="Image"
          width={220}
          height={220}
          className="absolute bottom-2/3 right-1/3 -mb-[100px] -mr-[60px] md:bottom-1/3 md:right-1/4 md:-mr-[80px] md:z-10"
        />
        <Image
          src={"/French.svg"}
          alt="Image"
          width={220}
          height={220}
          className="absolute top-1/2 right-1/3 md:right-3/4 md:top-2/3 md:-mr-[40px] md:z-10"
        />
        <Image
          src={"/Korean.svg"}
          alt="Image"
          width={220}
          height={220}
          className="hidden md:block md:absolute md:block md:bottom-3/4 md:right-1/3 md:mb-[50px]"
        />
        <Image
          src={"/Persian.svg"}
          alt="Image"
          width={180}
          height={180}
          className="hidden md:block md:absolute md:left-1/4 md:top-1/3 md:ml-[150px]"
        />
        <Image
          src={"/Portuguese.svg"}
          alt="Image"
          width={180}
          height={160}
          className="hidden md:block md:absolute md:top-1/3 md:left-3/4 md:transform md:-translate-y-1/2"
        />
        <Image
          src={"/Spanish.svg"}
          alt="Image"
          width={200}
          height={200}
          className="absolute bottom-3/4 left-1/2 md:left-1/4 md:top-1/4 md:-ml-[100px] md:-mt-[50px]"
        />
      </div>
      <div className="w-screen h-screen flex justify-center items-end pb-10">
        <div
          className="relative bg-[#E5E5E5] rounded-3xl shadow-lg"
          style={{ width: "550px", height: "249px" }}
        >
          {/* Yellow rectangle */}
          <div
            className="relative bg-[#E7FF97] shadow-lg"
            style={{
              width: "250px",
              height: "12px",
              marginTop: "45px",
              marginLeft: "150px",
            }}
          ></div>

          {/* Text content */}
          <div className="absolute inset-0 bottom-12 flex flex-col justify-center items-center">
            <span
              className="font-bold text-3xl mb-5"
              style={{ marginBottom: "10px" }}
            >
              Introducing Ava
            </span>
            <span
              className="text-center px-20 py-2 mb-7"
              style={{ marginLeft: "15px", marginRight: "15px" }}
            >
              Your automated verbal assistant to bridge the gaps between
              languages
            </span>
          </div>

          {/* Get Started button */}
          <div className="absolute bottom-6 w-full flex justify-center">
            <button
              className="bg-[#E7FF97] px-12 py-2 rounded-3xl text-lg font-black"
              style={{ height: "50px" }}
              onClick={handleClick}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetStarted;
