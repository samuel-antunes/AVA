"use client";
import Chat from "../components/Chat";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../utils/fontawesome";

config.autoAddCss = false;

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e5e5e5]">
      <h1 className="text-3xl font-bold mb-8">Chat with AVA</h1>
      <Chat />
    </div>
  );
};

export default App;
