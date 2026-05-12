import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-100">
                    Perfil
                </h2>
            }
        >
            <Head title="Perfil" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-4 sm:px-6 lg:px-8">
                    
                    {/* Tarjeta para Enrolamiento Facial */}
                    <div className="bg-slate-900/50 backdrop-blur-md p-4 shadow sm:rounded-lg sm:p-8 border border-slate-800">
                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-medium text-slate-100">
                                    Acceso Biométrico
                                </h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Configura tu rostro para poder iniciar sesión de forma rápida y segura.
                                </p>
                            </header>
                            <div className="mt-4">
                                <Link
                                    href={route('face.enrollment')}
                                    className="inline-flex items-center px-4 py-2 bg-sky-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-sky-600 focus:bg-sky-600 active:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Configurar Rostro
                                </Link>
                            </div>
                        </section>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-md p-4 shadow sm:rounded-lg sm:p-8 border border-slate-800">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-md p-4 shadow sm:rounded-lg sm:p-8 border border-slate-800">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-md p-4 shadow sm:rounded-lg sm:p-8 border border-slate-800">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
