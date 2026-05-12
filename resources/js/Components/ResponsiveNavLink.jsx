import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-sky-400 bg-sky-900/20 text-sky-400 focus:border-sky-500 focus:bg-sky-900/30 focus:text-sky-300'
                    : 'border-transparent text-slate-400 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-200 focus:border-slate-600 focus:bg-slate-800 focus:text-slate-200'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
