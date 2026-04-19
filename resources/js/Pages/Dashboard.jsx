import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const isAdmin = auth.user.roles?.some(r => r.name === 'administrador');
    const isGestor = auth.user.roles?.some(r => r.name === 'gestor');
    const isJugador = auth.user.roles?.some(r => r.name === 'jugador');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-200 leading-tight">Panel de Control</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Mensaje de Bienvenida */}
                    <div className="bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border border-gray-700">
                        <h3 className="text-2xl font-bold text-indigo-400 mb-2">¡Hola, {auth.user.name}!</h3>
                        <p className="text-gray-400">Bienvenido a tu centro de mando. ¿Qué vamos a hacer hoy?</p>
                    </div>

                    {/* VISTA ADMINISTRADOR */}
                    {isAdmin && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                                <h4 className="text-lg font-bold text-white mb-4">👥 Usuarios Activos</h4>
                                <p className="text-gray-400 mb-4">Gestiona las cuentas, asigna roles y mantén la seguridad de la plataforma.</p>
                                <Link href={route('users.index')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold transition">Ir a Usuarios</Link>
                            </div>
                        </div>
                    )}

                    {/* VISTA GESTOR */}
                    {isGestor && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                                <h4 className="text-lg font-bold text-white mb-4">🕹️ Mis Creaciones</h4>
                                <p className="text-gray-400 mb-4">Sube nuevos juegos, actualiza los existentes o retíralos del catálogo público.</p>
                                <Link href={route('games.index')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold transition">Gestionar Juegos</Link>
                            </div>
                        </div>
                    )}

                    {/* VISTA JUGADOR */}
                    {isJugador && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                                <h4 className="text-lg font-bold text-white mb-4">🎮 Listo para jugar</h4>
                                <p className="text-gray-400 mb-4">Explora el catálogo y demuestra tus habilidades. El reconocimiento facial está activado.</p>
                                <Link href={route('catalog.index')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition">Ir al Catálogo</Link>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                                <h4 className="text-lg font-bold text-white mb-4">📸 Enrolamiento Facial</h4>
                                <p className="text-gray-400 mb-4">Actualiza tu foto de seguridad biométrica para acceder a los juegos.</p>
                                <Link href={route('face.enrollment')} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded font-semibold transition">Configurar Rostro</Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}