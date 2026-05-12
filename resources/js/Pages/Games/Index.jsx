import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, games }) {
    const deleteGame = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este juego? Esta acción no se puede deshacer.')) {
            router.delete(route('games.destroy', id));
        }
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-100 leading-tight">Panel de Gestión de Juegos</h2>}
        >
            <Head title="Mis Juegos" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg p-6 border border-slate-800">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-100">Tus juegos registrados</h3>
                            <Link href={route('games.create')} className="bg-sky-500 text-white px-4 py-2 rounded shadow hover:bg-sky-600 transition font-semibold">
                                + Crear Nuevo Juego
                            </Link>
                        </div>

                        {/* Tabla de juegos */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm font-light text-slate-100">
                                <thead className="border-b border-slate-700 font-medium bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-slate-300">Título</th>
                                        <th className="px-6 py-4 text-slate-300">Estado</th>
                                        <th className="px-6 py-4 text-slate-300">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {games.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-center text-slate-500">
                                                Aún no tienes juegos creados.
                                            </td>
                                        </tr>
                                    ) : (
                                        games.map((game) => (
                                            <tr key={game.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                                                <td className="px-6 py-4 font-bold text-white">{game.title}</td>
                                                <td className="px-6 py-4">
                                                    {game.is_published ? (
                                                        <span className="text-emerald-400 font-bold">Publicado</span>
                                                    ) : (
                                                        <span className="text-red-400 font-bold">Oculto</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 flex gap-3">
                                                    <Link href={route('games.edit', game.id)} className="px-3 py-1 bg-slate-600 text-white rounded text-xs font-semibold hover:bg-slate-500 transition">Editar</Link>
                                                    <button onClick={() => deleteGame(game.id)} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition">Eliminar</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}