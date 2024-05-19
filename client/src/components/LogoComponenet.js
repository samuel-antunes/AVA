import React from "react";

const LogoComponent = () => {
    return (
        <div className="fixed top-0 left-1/4 md:left-20 pt-3 md:p-4">
            <img
                src="/Logo.png"
                alt="Picture of the logo"
                width={200}
                height={200}
                className="w-[15vw] h-[9vw] md:w-[6vw] md:h-[3vw]"
            />
        </div>
    );
};

export default LogoComponent;