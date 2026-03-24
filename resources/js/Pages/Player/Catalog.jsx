import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Catalog({ auth, games }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Catálogo de Juegos</h2>}
        >
            <Head title="Catálogo" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {games.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 bg-white p-6 rounded-lg shadow">
                                No hay juegos publicados en este momento.
                            </div>
                        ) : (
                            games.map((game) => (
                                <div key={game.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">{game.description}</p>
                                    </div>
                                    <Link
                                        href={route('catalog.play', game.id)}
                                        className="bg-green-600 text-white text-center px-4 py-2 rounded shadow hover:bg-green-700 w-full font-bold transition"
                                    >
                                        ¡Jugar Ahora!
                                    </Link>
                                </div>
                            ))
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}