"use client";
import { config } from "@fortawesome/fontawesome-svg-core";
import LogoComponent from "@/components/LogoComponenet";
import GetStarted from "@/components/GetStarted";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../utils/fontawesome";

config.autoAddCss = false;

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-light">
      <LogoComponent />
      <GetStarted />
    </div>
  );
};

export default App;
