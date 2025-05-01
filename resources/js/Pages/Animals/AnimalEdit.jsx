import { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import NavBar from "../../Components/NavBar";

export default function AnimalEdit({ auth }) {
    const { animal = {}, flash, errors = {} } = usePage().props; // Ensure animal is always an object

    // Initialize animal details state
    const [animalDetails, setAnimalDetails] = useState({
        type_name: animal.type_name || '',
        animal_number: animal.animal_number || '',
        years: animal.years || '',
    });

    // Handle animal input changes
    const handleAnimalChange = (e) => {
        setAnimalDetails({ ...animalDetails, [e.target.name]: e.target.value });
    };

    // Handle form submission for animal details
    // Handle form submission for animal details
    const handleSubmit = (e) => {
        e.preventDefault();

        router.put(`/animals/${animal.id}`, animalDetails)
            .then(() => {
                console.log("Animal updated successfully!");
                // Optionally, you can redirect or perform other actions here
            })
            .catch((error) => {
                console.error("Error updating animal:", error);
            });
    };


    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8 mt-12">
            <div className="w-full fixed top-0 bg-white shadow-md p-4 flex justify-center">
                <NavBar auth={auth} />
            </div>
            <div className="max-w-2xl w-full mt-10 bg-white p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-700 mb-6 text-center text-blue-500">Edit Animal</h3>

                {/* Display Success and Error Messages */}
                {flash?.success && (
                    <div className="alert alert-success p-4 bg-green-300 text-white text-left mb-4">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="alert alert-danger p-4 bg-red-300 text-white text-left mb-4">
                        {flash.error}
                    </div>
                )}

                {/* Display Validation Errors */}
                {Object.keys(errors).length > 0 && (
                    <div className="alert alert-danger p-4 bg-red-400 text-white text-left mb-4">
                        {Object.values(errors).map((msg, index) => (
                            <p key={index}>{msg}</p>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="flex-1 text-right mr-2 text-gray-600 font-semibold">Type:</span>
                        <select
                            name="type_name"
                            value={animalDetails.type_name}
                            onChange={handleAnimalChange}
                            className="flex-1 p-2 mr-2 border"
                        >
                            <option hidden>{animalDetails.type_name || "Select Animal"}</option>
                            <option value="Sheep">Sheep</option>
                            <option value="Cow">Cow</option>
                            <option value="Chicken">Chicken</option>
                            <option value="Horse">Horse</option>
                            <option value="Pig">Pig</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="flex-1 text-right mr-2 text-gray-600 font-semibold">Number:</span>
                        <input
                            type="text"
                            name="animal_number"
                            value={animalDetails.animal_number}
                            onChange={handleAnimalChange}
                            className="flex-1 p-2 mr-2 border"
                            placeholder="Animal number"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex-1 text-right mr-2 text-gray-600 font-semibold">Age:</span>
                        <input
                            type="number"
                            min="0"
                            max="20"
                            name="years"
                            value={animalDetails.years}
                            onChange={handleAnimalChange}
                            className="flex-1 p-2 mr-2 border"
                            placeholder="Animal age"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                            Update
                        </button>
                    </div>

                </form>


            </div>                <div className="mt-6 flex text-left max-w-2xl w-full">
                <Link href={`/animals/${animal.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Back
                </Link>
            </div>
        </div>
    );
}
