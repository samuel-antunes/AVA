import Chat from "../components/Chat";
import { config } from "@fortawesome/fontawesome-svg-core";
import LogoComponent from "@/components/LogoComponenet";
import GetStarted from "@/components/GetStarted";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../utils/fontawesome";

config.autoAddCss = false;

export const metadata = {
  title: "Chat with AVA",
  description: "A chat application using AVA",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-light" >
      <LogoComponent />
      <GetStarted />
      <h1 className="text-3xl font-bold mb-8">Chat with AVA</h1>
      <Chat />
    </div>
  );
}
