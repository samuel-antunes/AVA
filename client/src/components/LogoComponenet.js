import React from "react";

const LogoComponent = () => {
    return (
        <div className="fixed top-0 left-20 p-4">
            <img
                src="/Logo.png"
                alt="Picture of the logo"
                width={200}
                height={200}
                className="w-[6vw] h-[3vw]"
            />
        </div>
    );
};

export default LogoComponent;