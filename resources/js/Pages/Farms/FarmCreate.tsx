import React, { useState, ChangeEvent, FormEvent } from 'react';
import { usePage, router, Link, Head } from '@inertiajs/react';
import NavBar from "../../Components/NavBar";

// Define TypeScript types for Animal and Farm
type Animal = {
    id?: number;
    type_name: string;
    animal_number: string;
    years?: number | "";
};

type FarmDetails = {
    name: string;
    website: string;
    email: string;
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
    title: string;
};

const FarmCreate: React.FC<PageProps> = ({ auth }) => {
    const { flash, title, errors = {} } = usePage<PageProps>().props;

    // Initialize farm details state with empty values
    const [formData, setFormData] = useState<FarmDetails>({
        name: '',
        website: '',
        email: '',
    });

    // Initialize validation errors state
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    // Initialize farm animals state as empty
    const [animals, setAnimals] = useState<Animal[]>([]);

    // State to control visibility of new animal input fields
    const [showNewAnimalFields, setShowNewAnimalFields] = useState(false);

    // Handle farm input changes
    const handleFarmChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate form data
    const validate = () => {
        const errors: ValidationErrors = {};
        if (!formData.name) errors.name = 'Farm name is required';
        if (!formData.email) errors.email = 'Email is required';
        return errors;
    };

    // Handle form submission for creating a new farm
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            router.post('/farms', { ...formData, animals });
        }
    };

    const [newAnimal, setNewAnimal] = useState<Animal>({
        type_name: "",
        animal_number: "",
        years: "",
    });

    const handleNewAnimalChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewAnimal({ ...newAnimal, [e.target.name]: e.target.value });
    };

    // Validate new animal data
    const validateNewAnimal = () => {
        const errors: ValidationErrors = {};
        if (!newAnimal.type_name) errors.type_name = 'Animal type is required';
        if (!newAnimal.animal_number) {
            errors.animal_number = 'Animal number is required';
        } else if (!/^\d+$/.test(newAnimal.animal_number)) {
            errors.animal_number = 'Animal number must contain only digits';
        } else if (animals.some(animal => animal.animal_number === newAnimal.animal_number)) {
            errors.animal_number = 'Animal number must be unique';
        }
        return errors;
    };

    // Add a new animal entry
    const handleAddAnimal = () => {
        const errors = validateNewAnimal();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            setAnimals([...animals, { ...newAnimal }]);
            setNewAnimal({ type_name: "", animal_number: "", years: "" });
            setShowNewAnimalFields(false);
            setValidationErrors({});
        }
    };

    // Handle deleting animals
    const handleDeleteAnimal = (index: number) => {
        setAnimals(animals.filter((_, i) => i !== index));
    };

    // Toggle new animal fields and clear animal-related errors
    const toggleNewAnimalFields = () => {
        setShowNewAnimalFields(!showNewAnimalFields);
        if (showNewAnimalFields) {
            // Clear animal-related validation errors when closing the fields
            setValidationErrors((prevErrors) => {
                const { type_name, animal_number, ...rest } = prevErrors;
                return rest;
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8 mt-12">

            <Head title={title || "Laravel"} />

            <div className="w-full fixed top-0 bg-white shadow-md p-4 flex justify-center">
                <NavBar auth={auth} />
            </div>

            <h2 className="text-3xl font-bold text-gray-700 my-6">Create Farm</h2>

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

            {/* Farm Creation Form & Animal Display */}
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-700 mb-6 text-center text-blue-500">Farm Details</h3>

                {/* Farm Details */}
                <div className="grid grid-cols-[150px,1fr] gap-4 items-top border-b pb-6">
                    <label className="text-gray-600 font-semibold text-right">Farm Name*:</label>
                    <div className="flex-1">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleFarmChange}
                            placeholder="Enter farm name"
                            className="border p-2 w-full"
                        />
                        <div className="min-h-[20px]">
                            {validationErrors.name && <span className="text-red-500 block">{validationErrors.name}</span>}
                        </div>
                    </div>

                    <label className="text-gray-600 font-semibold text-right">Email*:</label>
                    <div className="flex-1">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFarmChange}
                            placeholder="Enter email"
                            className="border p-2 w-full"
                        />
                        <div className="min-h-[20px]">
                            {validationErrors.email && <span className="text-red-500 block">{validationErrors.email}</span>}
                        </div>
                    </div>

                    <label className="text-gray-600 font-semibold text-right">Website (optional):</label>
                    <div className="flex-1">
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleFarmChange}
                            placeholder="Enter website URL"
                            className="border p-2 w-full"
                        />
                    </div>
                </div>

                <div className="border-b pb-3">
                    <h3 className="text-xl font-bold text-gray-700 mt-3 text-center text-blue-500">Farm Animals</h3>
                    <div className="space-y-2 mt-4">
                        <div className="flex items-center justify-between">
                            <span className="flex-1 text-gray-600 font-semibold">Type:</span>
                            <span className="flex-1 text-gray-600 font-semibold">Number:</span>
                            <span className="flex-1 text-gray-600 font-semibold">Age:</span>
                        </div>

                        {/* Display the list of added animals in a table */}
                        <div className="mt-4">
                            {animals.length > 0 && (
                                <div className="w-full">
                                    <table className="w-full bg-white">
                                        <thead>
                                            <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                                                <th className="py-3 px-6 text-left">Type</th>
                                                <th className="py-3 px-6 text-left">Number</th>
                                                <th className="py-3 px-6 text-left">Age</th>
                                                <th className="py-3 px-6 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-600 text-sm font-light">
                                            {animals.map((animal, index) => (
                                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                                    <td className="py-3 px-6 text-left">{animal.type_name}</td>
                                                    <td className="py-3 px-6 text-left">#{animal.animal_number}</td>
                                                    <td className="py-3 px-6 text-left">{animal.years ? `${animal.years} years` : 'No info'}</td>
                                                    <td className="py-3 px-6 text-left">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteAnimal(index)}
                                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Add a new animal */}
                        <div className="text-left mt-4">
                            {showNewAnimalFields && (
                                <div className="flex items-center bg-blue-100 p-2">
                                    <select
                                        name="type_name"
                                        value={newAnimal.type_name}
                                        onChange={handleNewAnimalChange}
                                        className="flex-1 p-2 mr-2"
                                    >
                                        <option hidden>Select Animal</option>
                                        <option value="Sheep">Sheep</option>
                                        <option value="Cow">Cow</option>
                                        <option value="Chicken">Chicken</option>
                                        <option value="Horse">Horse</option>
                                        <option value="Pig">Pig</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="animal_number"
                                        value={newAnimal.animal_number}
                                        onChange={handleNewAnimalChange}
                                        placeholder="Animal number"
                                        className="flex-1 p-2 mr-2"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        name="years"
                                        value={newAnimal.years}
                                        onChange={handleNewAnimalChange}
                                        placeholder="Age"
                                        className="flex-1 p-2 mr-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddAnimal}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Save
                                    </button>
                                </div>
                            )}

                            <div className={`${showNewAnimalFields ? "bg-blue-100" : "bg-white-100"} px-2 pb-2 text-center`}>
                                <div className="min-h-[20px] text-left mb-2">
                                    {validationErrors.type_name && <span className="text-red-500 block">{validationErrors.type_name}</span>}
                                    {validationErrors.animal_number && <span className="text-red-500 block">{validationErrors.animal_number}</span>}
                                </div>

                                {animals.length < 3 && (
                                    <button
                                        type="button"
                                        onClick={toggleNewAnimalFields}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        {showNewAnimalFields ? "Cancel" : "+ Add Animal"}
                                    </button>
                                )}
                                {animals.length >= 3 && (
                                    <div className="alert alert-warning p-4 bg-orange-300 text-white text-left mb-4 max-w-2xl w-full">
                                        Maximum number of farm animals reached.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center mt-6">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                        Create Farm
                    </button>
                </div>
            </form>

            <div className="mt-6 flex text-left max-w-2xl w-full">
                <Link href="/farms" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Back to Farms
                </Link>
            </div>
        </div>
    );
};

export default FarmCreate;
