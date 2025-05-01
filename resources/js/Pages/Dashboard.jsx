import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import NavBar from '../Components/NavBar';
import { Head, usePage, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';

const handleDelete = (farmId) => {
    if (confirm("Are you sure you want to delete this farm?")) {
        router.delete(`/farms/${farmId}`);
    }
};

export default function Dashboard() {
    const { auth, farms = [] } = usePage().props; // ✅ Ensure farms is always an array

    return (
        <AuthenticatedLayout
            header={
                <h2 className="px-8 text-2xl mt-6 font-semibold leading-tight text-gray-800">
                    Welcome, {auth.user.name}!
                </h2>
            }
        >
            <Head title="Dashboard" />

            {/* ✅ Navbar Component */}
            <div className="w-full fixed top-0 bg-white shadow-md p-4 flex justify-center">
                <NavBar auth={auth} />
            </div>

            <div className="min-h-screen flex flex-col items-center p-8">
                {farms.length > 0 ? (
                    <div className="max-w-4xl w-full">
                        <h3 className="text-3xl font-bold mb-4 text-gray-700 text-center mb-6">Your Farms</h3>
                        <table className="w-full border border-gray-300 shadow-md bg-white">
                            <tbody>
                                {farms.map((farm) => (
                                    <tr key={farm.id} className="border-b border-gray-300 hover:bg-gray-100">
                                        <td className="px-4 py-4 font-semibold">{farm.name}</td>
                                        <td className="px-4 py-4">
                                            <Link
                                                href={`/farms/${farm.id}`}
                                                className="text-white bg-blue-500 px-3 py-2 rounded hover:bg-blue-600"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleDelete(farm.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="w-full text-left mt-6">
                            <Link href="/create-farm" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                Create New Farm
                            </Link>
                        </div>
                        <div className="w-full text-left mt-4">
                            <Link href="/create-animal" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                Create New Animal
                            </Link>
                        </div>

                    </div>
                ) : (
                    <p className="text-gray-500">You don’t have any farms yet.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
