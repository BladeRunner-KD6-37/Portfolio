// src/app/page.tsx
import Terminal from "@/components/Terminal";

export default function Home() {
  return (
    <main className="h-screen w-screen bg-zinc-950 flex flex-col p-4 md:p-6 justify-center items-center overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <Terminal />
      </div>
    </main>
  );
}