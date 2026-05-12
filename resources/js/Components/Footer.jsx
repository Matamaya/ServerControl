import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 p-6 text-center text-slate-400 text-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div>
                    &copy; {new Date().getFullYear()} <span className="text-sky-400 font-semibold">DokiGames</span>. Todos los derechos reservados.
                </div>
                <div className="flex space-x-4">
                    <a href="#" className="hover:text-white transition">Privacidad</a>
                    <a href="#" className="hover:text-white transition">Términos</a>
                    <a href="#" className="hover:text-white transition">Contacto</a>
                </div>
            </div>
        </footer>
    );
}
