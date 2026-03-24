import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, game }) {
    // Inicializamos el formulario con los datos ACTUALES del juego
    const { data, setData, put, processing, errors } = useForm({
        title: game.title || '',
        description: game.description || '',
        url_path: game.url_path || '',
        is_published: game.is_published ? true : false,
    });

    const submit = (e) => {
        e.preventDefault();
        // Usamos PUT y le pasamos el ID del juego a la ruta
        put(route('games.update', game.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Juego: {game.title}</h2>}
        >
            <Head title={`Editar ${game.title}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        <form onSubmit={submit} className="space-y-6">
                            {/* Campo Título */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Título del Juego *</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                />
                                {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
                            </div>

                            {/* Campo Descripción */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows="4"
                                />
                            </div>

                            {/* Campo URL Path */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">URL del juego (Externa)</label>
                                <input
                                    type="text"
                                    value={data.url_path}
                                    onChange={(e) => setData('url_path', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                />
                            </div>

                            {/* Campo Publicado */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_published}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Juego publicado (visible para jugadores)</span>
                            </div>

                            {/* Botones */}
                            <div className="flex items-center justify-end gap-4 mt-6">
                                <Link href={route('games.index')} className="text-gray-600 hover:underline">
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 disabled:opacity-50"
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