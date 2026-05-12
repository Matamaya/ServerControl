import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Catalog({ auth, games }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-100 leading-tight">Catálogo de Juegos</h2>}
        >
            <Head title="Catálogo" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {games.length === 0 ? (
                            <div className="col-span-full text-center text-slate-400 bg-slate-900/50 backdrop-blur-md p-6 rounded-lg border border-slate-800 shadow">
                                No hay juegos publicados en este momento.
                            </div>
                        ) : (
                            games.map((game) => (
                                <div key={game.id} className="bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg p-6 border border-slate-800 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-100 mb-2">{game.title}</h3>
                                        <p className="text-slate-300 mb-4 line-clamp-3">{game.description}</p>
                                    </div>
                                    <Link
                                        href={route('catalog.play', game.id)}
                                        className="bg-sky-500 text-white text-center px-4 py-2 rounded shadow hover:bg-sky-600 w-full font-bold transition"
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