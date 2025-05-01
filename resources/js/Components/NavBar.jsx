import { usePage, Link, router } from '@inertiajs/react';

export default function NavBar({ auth }) {
    const currentPath = usePage().url;

    return (
        <nav className="my-4">
            <ul className="flex space-x-4">
                <li><Link href="/" className="text-blue-500 hover:underline">Home</Link></li>
                {auth.user && (
                    <>
                        <li><Link href="/farms" className="text-blue-500 hover:underline">Farms</Link></li>
                        <li><Link href="/animals" className="text-blue-500 hover:underline">Animals</Link></li>
                    </>
                )}

                {auth.user && currentPath !== '/dashboard' && (
                    <li>
                        <Link href="/dashboard" className="text-green-500 hover:underline">Dashboard</Link>
                    </li>
                )}

                {auth.user && (
                    <li>
                        <button
                            onClick={() => router.post('/logout')}
                            className="text-red-500 hover:underline"
                        >
                            Logout
                        </button>
                    </li>
                )}

                {!auth.user && (
                    <li><Link href="/login" className="text-red-500 hover:underline">Login</Link></li>
                )}
            </ul>
        </nav>
    );
}
