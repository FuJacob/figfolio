export default function Home() {
  return (
    <main className="h-screen w-screen">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 2px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative w-full h-full"></div>
    </main>
  );
}
