import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, game }) {
    const { data, setData, put, processing, errors } = useForm({
        title: game.title || '',
        description: game.description || '',
        url_path: game.url_path || '',
        is_published: game.is_published ? true : false,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('games.update', game.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-100 leading-tight">Editar Juego: {game.title}</h2>}
        >
            <Head title={`Editar ${game.title}`} />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg p-6 border border-slate-800">

                        <form onSubmit={submit} className="space-y-6">
                            {/* Campo Título */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300">Título del Juego *</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full bg-slate-800 text-white border-slate-700 focus:border-sky-500 focus:ring-sky-500 rounded-md shadow-sm"
                                />
                                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                            </div>

                            {/* Campo Descripción */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300">Descripción</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full bg-slate-800 text-white border-slate-700 focus:border-sky-500 focus:ring-sky-500 rounded-md shadow-sm"
                                    rows="4"
                                />
                            </div>

                            {/* Campo URL Path */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300">URL del juego (Externa)</label>
                                <input
                                    type="text"
                                    value={data.url_path}
                                    onChange={(e) => setData('url_path', e.target.value)}
                                    className="mt-1 block w-full bg-slate-800 text-white border-slate-700 focus:border-sky-500 focus:ring-sky-500 rounded-md shadow-sm"
                                />
                            </div>

                            {/* Campo Publicado */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_published}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                    className="rounded border-slate-700 text-sky-500 shadow-sm focus:ring-sky-500 bg-slate-800"
                                />
                                <span className="ml-2 text-sm text-slate-300">Juego publicado (visible para jugadores)</span>
                            </div>

                            {/* Botones */}
                            <div className="flex items-center justify-end gap-4 mt-6">
                                <Link href={route('games.index')} className="text-slate-400 hover:text-white hover:underline transition">
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-slate-600 text-white px-4 py-2 rounded font-semibold hover:bg-slate-500 transition disabled:opacity-50"
                                >
                                    Actualizar Juego
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}