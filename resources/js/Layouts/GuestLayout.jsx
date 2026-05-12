import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col justify-between bg-slate-950 text-slate-100">
            <div className="flex-1 flex flex-col items-center justify-center pt-6 sm:pt-0">
                <div>
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-4xl font-extrabold text-sky-400">Doki</span>
                        <span className="text-4xl font-extrabold text-white">Games</span>
                    </Link>
                </div>

                <div className="mt-6 w-full overflow-hidden bg-slate-900 border border-slate-800 px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    );
}
