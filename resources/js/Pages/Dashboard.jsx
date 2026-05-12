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

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-4">

                    {/* Mensaje de Bienvenida */}
                    <div className="bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg p-6 border border-slate-800">
                        <h3 className="text-2xl font-bold text-sky-400 mb-2">¡Hola, {auth.user.name}!</h3>
                        <p className="text-slate-300">Bienvenido a tu centro de mando. ¿Qué vamos a hacer hoy?</p>
                    </div>

                    {/* VISTA ADMINISTRADOR */}
                    {isAdmin && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-lg border border-slate-800 shadow-lg">
                                <h4 className="text-lg font-bold text-white mb-4">Usuarios Activos</h4>
                                <p className="text-slate-300 mb-4">Gestiona las cuentas, asigna roles y mantén la seguridad de la plataforma.</p>
                                <Link href={route('users.index')} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold transition">Ir a Usuarios</Link>
                            </div>

                            <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-lg border border-slate-800 shadow-lg">
                                <h4 className="text-lg font-bold text-white mb-4">Configuración de Perfil</h4>
                                <p className="text-slate-300 mb-4">Actualiza tus datos personales, contraseña y preferencias de la cuenta.</p>
                                <Link href={route('profile.edit')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold transition">Editar Perfil</Link>
                            </div>
                        </div>
                    )}

                    {/* VISTA GESTOR */}
                    {isGestor && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-lg border border-slate-800 shadow-lg">
                                <h4 className="text-lg font-bold text-white mb-4">Mis Creaciones</h4>
                                <p className="text-slate-300 mb-4">Sube nuevos juegos, actualiza los existentes o retíralos del catálogo público.</p>
                                <Link href={route('games.index')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition">Gestionar Juegos</Link>
                            </div>

                            <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-lg border border-slate-800 shadow-lg">
                                <h4 className="text-lg font-bold text-white mb-4">Configuración de Perfil</h4>
                                <p className="text-slate-300 mb-4">Actualiza tus datos personales, contraseña y preferencias de la cuenta.</p>
                                <Link href={route('profile.edit')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold transition">Editar Perfil</Link>
                            </div>
                        </div>
                    )}

                    {/* VISTA JUGADOR */}
                    {isJugador && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-lg border border-slate-800 shadow-lg">
                                <h4 className="text-lg font-bold text-white mb-4">Listo para jugar</h4>
                                <p className="text-slate-300 mb-4">Explora el catálogo y demuestra tus habilidades. El reconocimiento facial está activado.</p>
                                <Link href={route('catalog.index')} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold transition">Ir al Catálogo</Link>
                            </div>
                            <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-lg border border-slate-800 shadow-lg">
                                <h4 className="text-lg font-bold text-white mb-4">Registro Facial</h4>
                                <p className="text-slate-300 mb-4">Actualiza tu foto de seguridad biométrica para acceder a los juegos.</p>
                                <Link href={route('face.enrollment')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold transition">Configurar Rostro</Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}