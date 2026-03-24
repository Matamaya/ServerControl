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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel de Administración: Usuarios</h2>}
        >
            <Head title="Gestión de Usuarios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Usuarios del Sistema</h3>
                            <Link href={route('users.create')} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                                + Nuevo Usuario
                            </Link>
                        </div>

                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b font-medium bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4">Nombre</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Roles Asignados</th>
                                    <th className="px-6 py-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-bold">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            {/* Aquí mostramos las "etiquetas" con los roles del usuario */}
                                            {user.roles.length > 0 ? (
                                                user.roles.map(role => (
                                                    <span key={role.id} className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-bold mr-2 uppercase">
                                                        {role.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 italic text-sm">Sin rol asignado</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 flex gap-3">
                                            {/* Botones de acción (los conectaremos en el siguiente paso) */}
                                            <Link href={route('users.edit', user.id)} className="text-yellow-600 hover:underline font-semibold">Editar Roles</Link>
                                            <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:underline font-semibold">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}