import { usePage, Link, router } from '@inertiajs/react';
import NavBar from '../../Components/NavBar';

export default function Animals({ auth }) {
    const { animals, flash, errors = {} } = usePage().props; // ✅ Includes pagination metadata

    // Function to handle animal deletion
    const handleDelete = (animalId) => {
        if (confirm('Are you sure you want to delete this animal?')) {
            router.delete(`/animals/${animalId}`)
                .then(() => {
                    console.log('Animal deleted successfully');
                })
                .catch((error) => {
                    console.error('Error deleting animal:', error);
                });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
            <div className="w-full fixed top-0 bg-white shadow-md p-4 flex justify-center">
                <NavBar auth={auth} />
            </div>
            <div className="mt-10">
                <h2 className="text-3xl font-bold text-gray-700 my-6 text-center mt-10">Animals List</h2>
            </div>

            <div className="max-w-4xl w-full">
            {flash?.success && (
                <div className="alert alert-success p-4 bg-green-300 text-white text-left mb-4 w-full">
                    {flash.success}
                </div>
            )}
                <table className="w-full border border-gray-300 shadow-md rounded-lg bg-white">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                        <tr>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Number</th>
                            <th className="px-4 py-2 text-left">Age</th>
                            <th className="px-4 py-2 text-left">Farm</th>
                            <th className="px-4 py-2 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {animals.data.map((animal) => (
                            <tr key={animal.id} className="border-b border-gray-300 hover:bg-gray-100">
                                <td className="px-4 py-4">{animal.type_name}</td>
                                <td className="px-4 py-4 font-semibold">#{animal.animal_number}</td>
                                <td className="px-4 py-4">
                                {animal.years !== null ? (
    <span className="text-gray-800">{animal.years} years</span>
) : (
    <span className="text-gray-500">No info</span>
)}
                                    </td>
                                <td className="px-4 py-4">
                                    {animal.farm && (
                                        <Link href={`/farms/${animal.farm.id}`} className="text-blue-500 hover:underline">
                                            {animal.farm.name}
                                        </Link>
                                    )}
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex justify-center space-x-2">
                                        <Link
                                            href={`/animals/${animal.id}`}
                                            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(animal.id)}
                                            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="mt-6 flex justify-center space-x-4">
                    {animals.links.map((link, index) => (
                        link.url && (
                            <Link
                                key={index}
                                href={link.url}
                                className={`px-4 py-2 rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} // Fix Laravel pagination HTML labels
                            />
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}
