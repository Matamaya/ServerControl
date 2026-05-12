import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, users, roles }) {
    const deleteUser = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este usuario de forma permanente?')) {
            router.delete(route('users.destroy', id));
        }
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-100 leading-tight">Panel de Administración: Usuarios</h2>}
        >
            <Head title="Gestión de Usuarios" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg p-6 border border-slate-800">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-100">Usuarios del Sistema</h3>
                            <Link href={route('users.create')} className="bg-sky-500 text-white px-4 py-2 rounded shadow hover:bg-sky-600 transition font-semibold">
                                + Nuevo Usuario
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm font-light text-slate-100">
                                <thead className="border-b border-slate-700 font-medium bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-slate-300">Nombre</th>
                                        <th className="px-6 py-4 text-slate-300">Email</th>
                                        <th className="px-6 py-4 text-slate-300">Roles Asignados</th>
                                        <th className="px-6 py-4 text-slate-300">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                                            <td className="px-6 py-4 font-bold text-white">{user.name}</td>
                                            <td className="px-6 py-4 text-slate-400">{user.email}</td>
                                            <td className="px-6 py-4">
                                                {user.roles.length > 0 ? (
                                                    user.roles.map(role => (
                                                        <span key={role.id} className="inline-block bg-sky-500/20 text-sky-400 text-xs px-2 py-1 rounded-full font-bold mr-2 uppercase">
                                                            {role.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-500 italic text-sm">Sin rol asignado</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 flex gap-3">
                                                <Link href={route('users.edit', user.id)} className="px-3 py-1 bg-slate-600 text-white rounded text-xs font-semibold hover:bg-slate-500 transition">Editar</Link>
                                                <button onClick={() => deleteUser(user.id)} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}