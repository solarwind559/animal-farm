import { usePage, Link, router } from '@inertiajs/react';
import NavBar from '../../Components/NavBar';

export default function Farms({ auth }) {
    const { farms, flash, errors ={} } = usePage().props; // ✅ Includes pagination metadata

    // Function to handle farm deletion
    const handleDelete = (farmId) => {
        if (confirm('Are you sure you want to delete this farm?')) {
            router.delete(`/farms/${farmId}`)
                .then(() => {
                    console.log('Farm deleted successfully');
                })
                .catch((error) => {
                    console.error('Error deleting farm:', error);
                });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
            <div className="w-full fixed top-0 bg-white shadow-md p-4 flex justify-center mb-10">
                <NavBar auth={auth} />
            </div>
            <div className="mt-10">
                <h2 className="text-3xl font-bold my-6 text-gray-700 mt-10">Farms List</h2>
            </div>
            <div className="overflow-x-auto w-full max-w-4xl">
            {flash?.success && (
                <div className="alert alert-success p-4 bg-green-300 text-white text-left mb-4 w-full">
                    {flash.success}
                </div>
            )}
                <table className="w-full bg-white border border-gray-300 shadow-md rounded-lg">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                        <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Website</th>
                            <th className="px-4 py-2 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {farms.data.map((farm) => ( // ✅ Use `farms.data` for pagination support
                            <tr key={farm.id} className="border-b border-gray-300 hover:bg-gray-100">
                                <td className="px-4 py-2 font-semibold">{farm.name}</td>
                                <td className="px-4 py-2">{farm.email}</td>
                                <td className="px-4 py-2">
                                {farm.website ? (
    <a href={farm.website} className="text-blue-500 hover:underline">
        {farm.website}
    </a>
) : (
    <span className="text-gray-500">No info</span>
)}

                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex justify-center space-x-2">
                                        <Link
                                            href={`/farms/${farm.id}`}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center whitespace-nowrap"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(farm.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-center whitespace-nowrap"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex justify-center space-x-4">
                {farms.links.map((link, index) => (
                    link.url && (
                        <Link
                            key={index}
                            href={link.url}
                            className={`px-4 py-2 rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} // ✅ Fix Laravel pagination HTML labels
                        />
                    )
                ))}
            </div>
        </div>
    );
}
