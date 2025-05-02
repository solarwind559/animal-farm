import React, { useState, ChangeEvent, FormEvent } from 'react';
import { usePage, router, Link, Head } from '@inertiajs/react';
import NavBar from "../../Components/NavBar";

// Define TypeScript types for Animal and Farm
type Animal = {
    id?: number;
    type_name: string;
    animal_number: string;
    years?: number | "";
    farm_id?: number;
};

type Farm = {
    id: number;
    name: string;
};

type ValidationErrors = Record<string, string>;

type FlashMessages = {
    success?: string;
    error?: string;
};

type AuthProps = {
    user?: { id: number; name: string } | null;
};

// Define Page Props for the Component
type PageProps = {
    auth: AuthProps;
    flash?: FlashMessages;
    errors?: ValidationErrors;
    animal: Animal;
    farms: Farm[];
    title: string;
};

const AnimalEdit: React.FC<PageProps> = ({ auth }) => {
    const { animal, title, farms = [], flash, errors = {} } = usePage<PageProps>().props;

    // Initialize animal details state with default values
    const [animalDetails, setAnimalDetails] = useState<Animal>({
        type_name: animal.type_name || '',
        animal_number: animal.animal_number || '',
        years: animal.years || '',
        farm_id: animal.farm_id || (farms.length > 0 ? farms[0].id : undefined),
    });

    // Initialize validation errors state
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    // Handle animal input changes
    const handleAnimalChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAnimalDetails({ ...animalDetails, [e.target.name]: e.target.value });
    };

    // Validate animal data
    const validateAnimal = () => {
        const errors: ValidationErrors = {};
        if (!animalDetails.type_name) errors.type_name = 'Animal type is required';
        if (!animalDetails.animal_number) {
            errors.animal_number = 'Animal number is required';
        } else if (!/^\d+$/.test(animalDetails.animal_number)) {
            errors.animal_number = 'Animal number must be an integer';
        }
        return errors;
    };

    // Handle form submission for animal details
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const errors = validateAnimal();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            router.put(`/animals/${animal.id}`, animalDetails);
        }
    };
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8 mt-12">

            <Head title={title || "Laravel"} />

            <div className="w-full fixed top-0 bg-white shadow-md p-4 flex justify-center">
                <NavBar auth={auth} />
            </div>
            <h2 className="text-3xl font-bold text-gray-700 my-6">Edit Animal Details</h2>

            <div className="max-w-2xl w-full bg-white p-6 shadow-lg">

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
                        <label className="flex-1 text-right mr-2 text-gray-600 font-semibold">Type:</label>
                        <select
                            name="type_name"
                            value={animalDetails.type_name}
                            onChange={handleAnimalChange}
                            className="flex-1 p-2 mr-2 border"
                        >
                            <option hidden>Select Animal</option>
                            <option value="Sheep">Sheep</option>
                            <option value="Cow">Cow</option>
                            <option value="Chicken">Chicken</option>
                            <option value="Horse">Horse</option>
                            <option value="Pig">Pig</option>
                        </select>
                    </div>
                        <div className="flex-1 min-h-[20px]">
                        </div>

                    <div className="flex items-center justify-between">
                        <label className="flex-1 text-right mr-2 text-gray-600 font-semibold">Number:</label>
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
                        <div className="flex-1"></div>
                        <div className="flex-1 min-h-[20px] mr-2 pt-1 pb-2">
                            {validationErrors.animal_number && <span className="text-red-500 block text-left">{validationErrors.animal_number}</span>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <label className="flex-1 text-right mr-2 text-gray-600 font-semibold">Age:</label>
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

                    <div className="flex items-center justify-between">
                        <label className="flex-1 text-right mr-2 text-gray-600 font-semibold">Farm:</label>
                        <select
                            name="farm_id"
                            value={animalDetails.farm_id}
                            onChange={handleAnimalChange}
                            className="flex-1 p-2 mr-2 border"
                        >
                            {farms.map((farm) => (
                                <option key={farm.id} value={farm.id}>
                                    {farm.name}
                                </option>
                            ))}
                        </select>
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
            </div>
            <div className="mt-6 flex text-right max-w-2xl w-full">
                <Link href={`/animals/${animal.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Back
                </Link>
            </div>
        </div>
    );
};

export default AnimalEdit;
