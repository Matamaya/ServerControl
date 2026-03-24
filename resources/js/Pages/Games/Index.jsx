import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, games }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel de Gestión de Juegos</h2>}
        >
            <Head title="Mis Juegos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Tus juegos registrados</h3>
                            <Link href={route('games.create')} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                                + Crear Nuevo Juego
                            </Link>
                        </div>

                        {/* Tabla de juegos */}
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b font-medium">
                                <tr>
                                    <th className="px-6 py-4">Título</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {games.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                            Aún no tienes juegos creados.
                                        </td>
                                    </tr>
                                ) : (
                                    games.map((game) => (
                                        <tr key={game.id} className="border-b">
                                            <td className="px-6 py-4 font-bold">{game.title}</td>
                                            <td className="px-6 py-4">
                                                {game.is_published ? (
                                                    <span className="text-green-600 font-bold">Publicado</span>
                                                ) : (
                                                    <span className="text-red-600 font-bold">Oculto</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <Link href={route('games.edit', game.id)} className="text-blue-600 hover:underline">Editar</Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}