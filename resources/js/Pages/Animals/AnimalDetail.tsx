import { usePage, Link, Head } from "@inertiajs/react";
import NavBar from "../../Components/NavBar";

// ✅ Define TypeScript types for Animal & Flash Messages
type Farm = {
    id: number;
    name: string;
    user_id: number;
};

type Animal = {
    id: number;
    type_name: string;
    animal_number: string;
    years?: number | null;
    farm?: Farm;
};

type FlashMessages = {
    success?: string;
};

type AuthProps = {
    user?: { id: number; name: string } | null;
};

// ✅ Define Page Props for the Component
type PageProps = {
    auth: AuthProps;
    animal: Animal;
    flash?: FlashMessages;
    title: string;
};

export default function AnimalDetail({ auth }: PageProps) {
    const { animal, title, flash = {} } = usePage<PageProps>().props;

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
                    <h2 className="text-3xl font-bold text-gray-700">Animal Details</h2>
                    {animal.farm && animal.farm.user_id === auth.user?.id && (
                        <Link
                            href={`/animals/${animal.id}/edit`}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Edit
                        </Link>
                    )}
                </div>

                {/* Animal Details */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold text-gray-600">Type:</span>
                        <span className="text-gray-800">{animal.type_name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold text-gray-600">Number:</span>
                        <span className="text-gray-800">#{animal.animal_number}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold text-gray-600">Age:</span>
                        {animal.years !== null ? (
                            <span className="text-gray-800">{animal.years} years</span>
                        ) : (
                            <span className="text-gray-500">No info</span>
                        )}
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold text-gray-600">Farm:</span>
                        {animal.farm ? (
                            <Link href={`/farms/${animal.farm.id}`} className="text-blue-500 hover:underline">
                                {animal.farm.name}
                            </Link>
                        ) : (
                            <span className="text-gray-500">No associated farm</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-6 flex justify-start max-w-2xl w-full">
                <Link href="/animals" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Back to Animals
                </Link>
            </div>
        </div>
    );
}
