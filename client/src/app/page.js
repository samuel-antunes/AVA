import Chat from "../components/Chat";

export const metadata = {
  title: "Chat with AVA",
  description: "A chat application using AVA",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Chat with AVA</h1>
      <Chat />
    </div>
  );
}
