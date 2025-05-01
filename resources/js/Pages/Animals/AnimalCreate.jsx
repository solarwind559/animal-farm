import { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import NavBar from "../../Components/NavBar";

export default function AnimalCreate({ auth }) {
    const { farms = [], flash, errors = {} } = usePage().props; // Ensure farms is always an array

    // Initialize animal details state
    const [animalDetails, setAnimalDetails] = useState({
        farm_id: '',
        type_name: "",
        animal_number: "",
        years: "",
    });

    // Initialize validation errors state
    const [validationErrors, setValidationErrors] = useState({});

    // Handle animal input changes
    const handleAnimalChange = (e) => {
        setAnimalDetails({ ...animalDetails, [e.target.name]: e.target.value });
    };

    // Validate form data
    const validate = () => {
        const errors = {};
        if (!animalDetails.farm_id) errors.farm_id = 'Farm selection is required';
        if (!animalDetails.type_name) errors.type_name = 'Animal type selection is required';
        if (!animalDetails.animal_number) errors.animal_number = 'Animal number is required';
        return errors;
    };

    // Handle form submission for creating a new animal
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            router.post('/animals', animalDetails)
                .then(() => {
                    // Optionally handle success here
                })
                .catch((error) => {
                    console.error("Error creating animal:", error);
                });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8 mt-12">
            <div className="w-full fixed top-0 bg-white shadow-md p-4 flex justify-center">
                <NavBar auth={auth} />
            </div>
            <h2 className="text-3xl font-bold text-gray-700 my-6">Create Animal</h2>

            {flash?.success && (
                <div className="alert alert-success p-4 bg-green-300 text-white text-left mb-4 max-w-2xl w-full">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="alert alert-danger p-4 bg-red-300 text-white text-left mb-4 max-w-2xl w-full">
                    {flash.error}
                </div>
            )}

            {/* Display validation errors */}
            {Object.keys(errors).length > 0 && (
                <div className="alert alert-danger p-4 bg-red-400 text-white text-left mb-4 max-w-2xl w-full">
                    {Object.values(errors).map((msg, index) => (
                        <p key={index}>{msg}</p>
                    ))}
                </div>
            )}

            {/* Animal Creation Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-6 shadow-lg">
                <div className="space-y-4">
                    <div className="flex items-center">
                        <label className="text-gray-600 font-semibold w-1/3">Farm*:</label>
                        <div className="flex-1">
                            <select
                                name="farm_id"
                                value={animalDetails.farm_id}
                                onChange={handleAnimalChange}
                                className="p-2 border w-full"
                            >
                                <option value="" hidden>Select Farm</option>
                                {farms.map((farm) => (
                                    <option key={farm.id} value={farm.id}>
                                        {farm.name}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.farm_id && <span className="text-red-500 mt-1 block">{validationErrors.farm_id}</span>}
                        </div>
                    </div>
                    <div className="flex items-top">
                        <label className="text-gray-600 font-semibold w-1/3">Animal Type*:</label>
                        <div className="flex-1">
                            <select
                                name="type_name"
                                value={animalDetails.type_name}
                                onChange={handleAnimalChange}
                                className="p-2 border w-full"
                            >
                                <option hidden>Select Animal</option>
                                <option value="Sheep">Sheep</option>
                                <option value="Cow">Cow</option>
                                <option value="Chicken">Chicken</option>
                                <option value="Horse">Horse</option>
                                <option value="Pig">Pig</option>
                            </select>
                            {validationErrors.type_name && <span className="text-red-500 mt-1 block">{validationErrors.type_name}</span>}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label className="text-gray-600 font-semibold w-1/3">Animal Number*:</label>
                        <div className="flex-1">
                            <input
                                type="text"
                                name="animal_number"
                                value={animalDetails.animal_number}
                                onChange={handleAnimalChange}
                                placeholder="Animal number"
                                className="p-2 border w-full"
                            />
                            {validationErrors.animal_number && <span className="text-red-500 mt-1 block">{validationErrors.animal_number}</span>}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label className="text-gray-600 font-semibold w-1/3">Age (optional):</label>
                        <div className="flex-1">
                            <input
                                type="number"
                                min="0"
                                max="20"
                                name="years"
                                value={animalDetails.years}
                                onChange={handleAnimalChange}
                                placeholder="Age"
                                className="p-2 border w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center mt-6">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                        Save Animal
                    </button>
                </div>
            </form>

            <div className="mt-6 flex text-left max-w-2xl w-full">
                <Link href="/animals" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Back to Animals
                </Link>
            </div>
        </div>
    );
}
