import { Head, Link } from '@inertiajs/react';
import NavBar from '../Components/NavBar';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            {auth.user && (
            <div className="w-full fixed top-0 bg-white shadow-md p-4 flex justify-center">
                <NavBar auth={auth} />
            </div>
)}
            <div className="flex flex-col items-center justify-center min-h-screen pt-20">
                <h1 className="text-4xl font-bold">Welcome to the Farm App 🌾</h1>
                {auth.user && (
                    <h2 className="mt-5">Visit your&nbsp;
                        <Link href="/dashboard" className="text-green-500 hover:underline">Dashboard</Link>
                    </h2>
                )}
            {!auth.user && (
                <h2 className="mt-5">
                    <Link href="/login" className="text-red-500 hover:underline">Login</Link> to continue
                </h2>
            )}

            </div>
        </>
    );

}
