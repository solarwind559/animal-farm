import { usePage, Link, Head } from "@inertiajs/react";
import NavBar from "../../Components/NavBar";

// ✅ Define TypeScript types for Farm, Animal, and Flash Messages
type Animal = {
    id: number;
    type_name: string;
    animal_number: string;
    years?: number;
};

type Farm = {
    id: number;
    name: string;
    email: string;
    website?: string;
    user_id: number;
    animals: Animal[];
};

type FlashMessages = {
    success?: string;
};

type AuthProps = {
    user?: { id: number; name: string } | null;
};

// ✅ Define Page Props for Inertia
type PageProps = {
    auth: AuthProps;
    farm: Farm;
    flash?: FlashMessages;
    title: string;
};

export default function FarmDetail({ auth }: PageProps) {
    const { farm, title, flash } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8 mt-12">

            <Head title={title || "Laravel"} />

            <div className="w-full fixed top-0 bg-white shadow-md p-4 flex justify-center">
                <NavBar auth={auth} />
            </div>

            <div className="max-w-2xl w-full mt-10 bg-white p-6 shadow-lg">
                {/* Success Message */}
                {flash?.success && (
                    <div className="alert alert-success p-4 bg-green-300 text-white text-left mb-4 max-w-2xl w-full">
                        {flash.success}
                    </div>
                )}

                {/* Page Header & Edit Button */}
                <div className="flex flex-row justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-3xl font-bold text-gray-700">Farm Details</h2>
                    {farm.user_id === auth.user?.id && (
                        <Link
                            href={`/farms/${farm.id}/edit`}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Edit
                        </Link>
                    )}
                </div>

                {/* Farm Details */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold text-gray-600">Farm Name:</span>
                        <span className="text-gray-800">{farm.name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold text-gray-600">Email:</span>
                        <span className="text-gray-800">{farm.email}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold text-gray-600">Website:</span>
                        {farm.website ? (
                            <a href={farm.website} className="text-blue-500 hover:underline">
                                {farm.website}
                            </a>
                        ) : (
                            <span className="text-gray-500">No info</span>
                        )}
                    </div>
                </div>

                {/* Farm Animals */}
                <h3 className="text-2xl font-bold text-gray-700 mt-6 mb-4">Farm Animals</h3>
                {farm.animals.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                                <th className="border border-gray-300 px-4 py-2">Type</th>
                                <th className="border border-gray-300 px-4 py-2">Number</th>
                                <th className="border border-gray-300 px-4 py-2">Age</th>
                            </tr>
                        </thead>
                        <tbody>
                            {farm.animals.map((animal) => (
                                <tr key={animal.id} className="border-b border-gray-300">
                                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{animal.type_name}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{animal.animal_number}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-800">
                                        {animal.years !== null ? (
                                            <span className="text-gray-800">{animal.years} years</span>
                                        ) : (
                                            <span className="text-gray-500">No info</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-gray-500">No animals have been added</div>
                )}
            </div>

            {/* Back Button */}
            <div className="mt-6 flex justify-start max-w-2xl w-full">
                <Link href="/farms" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Back to Farms
                </Link>
            </div>
        </div>
    );
}
