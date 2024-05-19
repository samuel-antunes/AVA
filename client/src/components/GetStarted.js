'use client'

import React from "react";
import { useRouter } from "next/navigation";

const GetStarted = () => {
    const router = useRouter();
    
    const handleClick = () => {
        router.push("/another-page");
    };

    return (
        <div className="w-screen h-screen flex justify-center items-end pb-10">
        <div className="relative bg-[#E5E5E5] rounded-3xl shadow-lg" style={{ width: '550px', height: '249px' }}>
          {/* Yellow rectangle */}
          <div 
            className="relative bg-[#E7FF97] shadow-lg" 
            style={{ width: '250px', height: '12px', marginTop: '45px', marginLeft: '150px'}}>
          </div>
  
          {/* Text content */}
          <div className="absolute inset-0 bottom-12 flex flex-col justify-center items-center">
            <span 
                className="font-bold text-3xl mb-5" 
                style={{ marginBottom: '10px' }}>
                Introducing Ava
            </span>
            <span 
                className="text-center px-20 py-2 mb-7"
                style={{ marginLeft: '15px', marginRight: '15px' }}>
                Your automated verbal assistant to bridge the gaps between languages</span>
          </div>
  
          {/* Get Started button */}
          <div className="absolute bottom-6 w-full flex justify-center">
                <button 
                    className="bg-[#E7FF97] px-12 py-2 rounded-3xl text-lg font-black" 
                    style={{height: '50px' }}
                    onClick={handleClick}>
                    Get Started
                </button>
          </div>
        </div>
      </div>
    );
};

export default GetStarted;
