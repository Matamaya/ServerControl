import { Head, Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Bienvenido a DokiGames" />
            <div className="relative min-h-screen bg-[#0c0d14] text-white overflow-hidden flex flex-col justify-between">

                {/* Navigation */}
                <nav className="relative z-10 flex justify-between items-center p-6 backdrop-blur-md bg-[#0c0d14]/50 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-extrabold text-sky-400">Doki</span>
                        <span className="text-2xl font-extrabold text-white">Games</span>
                    </div>
                    <div className="space-x-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md font-semibold transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 text-slate-300 hover:text-white transition"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md font-semibold transition"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">

                    {/* Logo Big */}
                    <div className="mb-6 flex flex-col items-center">
                        <div className="w-20 h-20 bg-sky-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-sky-500/30 transform rotate-12">
                            <span className="text-4xl font-bold text-white transform -rotate-12">D</span>
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight">
                            <span className="text-sky-400">Doki</span> games
                        </h1>
                    </div>

                    {/* Slogan */}
                    <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-8">
                        Diversión al instante
                        <br></br> ¡Tu plataforma favorita para jugar!
                    </p>

                    {/* CTA */}
                    <Link
                        href={auth.user ? route('dashboard') : route('login')}
                        className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white text-lg font-bold rounded-full transition transform hover:scale-105 shadow-lg shadow-sky-600/30"
                    >
                        ¡A Jugar!
                    </Link>


                </main>

                {/* Floating Shapes */}
                {/* Yellow Plus Sign (Left) */}
                <div className="absolute left-[-20px] lg:left-[50px] bottom-1/4 transform rotate-12 opacity-80 lg:opacity-100 scale-75 lg:scale-100">
                    <div className="relative w-32 h-32">
                        <div className="absolute inset-0 m-auto w-8 h-32 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-xl shadow-lg"></div>
                        <div className="absolute inset-0 m-auto w-32 h-8 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-xl shadow-lg"></div>
                    </div>
                </div>

                {/* Green Block (Right) */}
                <div className="absolute right-[-20px] lg:right-[50px] top-1/3 transform rotate-45 opacity-80 lg:opacity-100 scale-75 lg:scale-100">
                    <div className="w-40 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg"></div>
                </div>

                {/* Purple Blob (Top center background) */}
                <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl"></div>

                <Footer />
            </div>
        </>
    );
}
