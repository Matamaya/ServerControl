import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, userToEdit, roles }) {
    const initialRoleId = userToEdit.roles.length > 0 ? userToEdit.roles[0].id : '';

    const { data, setData, put, processing, errors } = useForm({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        role_id: initialRoleId,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('users.update', userToEdit.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-100 leading-tight">Editar Usuario: {userToEdit.name}</h2>}
        >
            <Head title={`Editar ${userToEdit.name}`} />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg p-6 border border-slate-800">

                        <form onSubmit={submit} className="space-y-6">
                            {/* Campo Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300">Nombre Completo *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full bg-slate-800 text-white border-slate-700 focus:border-sky-500 focus:ring-sky-500 rounded-md shadow-sm"
                                />
                                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>

                            {/* Campo Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300">Correo Electrónico *</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full bg-slate-800 text-white border-slate-700 focus:border-sky-500 focus:ring-sky-500 rounded-md shadow-sm"
                                />
                                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                            </div>

                            {/* Selector de Rol */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300">Rol del Usuario *</label>
                                <select
                                    value={data.role_id}
                                    onChange={(e) => setData('role_id', e.target.value)}
                                    className="mt-1 block w-full bg-slate-800 text-white border-slate-700 focus:border-sky-500 focus:ring-sky-500 rounded-md shadow-sm"
                                >
                                    <option value="" disabled className="text-slate-500">Seleccione un rol...</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id} className="bg-slate-800 text-white">
                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)} - {role.description}
                                        </option>
                                    ))}
                                </select>
                                {errors.role_id && <div className="text-red-500 text-sm mt-1">{errors.role_id}</div>}
                            </div>

                            {/* Botones */}
                            <div className="flex items-center justify-end gap-4 mt-6">
                                <Link href={route('users.index')} className="text-slate-400 hover:text-white hover:underline transition">
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-slate-600 text-white px-4 py-2 rounded font-semibold hover:bg-slate-500 transition disabled:opacity-50"
                                >
                                    Actualizar Usuario
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}