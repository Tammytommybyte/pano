export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white font-sans">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-center">
          Eurekaa <span className="text-blue-400">Graduaciones</span>
        </h1>
        
        <p className="text-xl text-center max-w-2xl">
          Bienvenido al portal oficial de Eurekaa. Escanea tus códigos QR para consultar listas de precios y servicios.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 w-full max-w-4xl">
          <a href="/legal/privacidad.html" className="flex flex-col gap-4 rounded-xl bg-white/5 p-6 border border-white/10 hover:bg-white/10 transition">
            <h3 className="text-2xl font-bold">Aviso de Privacidad →</h3>
            <p className="text-slate-400">Protección y tratamiento de sus datos personales.</p>
          </a>
          
          <a href="/legal/terminos.html" className="flex flex-col gap-4 rounded-xl bg-white/5 p-6 border border-white/10 hover:bg-white/10 transition">
            <h3 className="text-2xl font-bold">Términos y Condiciones →</h3>
            <p className="text-slate-400">Condiciones de uso de nuestros servicios digitales.</p>
          </a>
        </div>
      </div>
    </main>
  );
}
