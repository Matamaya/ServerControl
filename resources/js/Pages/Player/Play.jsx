import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Play({ auth, game, gameToken }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Jugando: {game.title}</h2>
                    <Link href={route('catalog.index')} className="text-sm text-blue-600 hover:underline">
                        &larr; Volver al catálogo
                    </Link>
                </div>
            }
        >
            <Head title={game.title} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 h-[75vh]">
                    <div className="bg-black w-full h-full rounded-lg shadow-xl overflow-hidden border-4 border-gray-800 relative">

                        {/* Aquí está la magia. El iframe carga la URL del juego (Three.js) 
                            pero el usuario sigue dentro de Laravel viendo el menú de arriba.
                        */}
                        {game.url_path ? (
                            <iframe
                                src={`${game.url_path}${game.url_path.includes('?') ? '&' : '?'}gameId=${game.id}&apiBaseUrl=${window.location.origin}/api&token=${gameToken}`}
                                className="w-full h-full border-0"
                                title={`Juego ${game.title}`}
                                allow="camera; microphone; fullscreen" // Permisos clave para el futuro reconocimiento facial/emociones
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full text-white">
                                <p>Este juego no tiene una URL configurada.</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}