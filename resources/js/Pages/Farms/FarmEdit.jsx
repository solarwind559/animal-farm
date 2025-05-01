import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { router, Link } from '@inertiajs/react';
import NavBar from "../../Components/NavBar";

export default function FarmEdit({ auth }) {
    const { farm, flash, errors = {} } = usePage().props; // Access validation errors

    // Initialize farm details state
    const [formData, setFormData] = useState({
        name: farm.name,
        website: farm.website,
        email: farm.email,
    });

    // Initialize farm animals state
    const [animals, setAnimals] = useState(farm.animals || []);

    // State to control visibility of new animal input fields
    const [showNewAnimalFields, setShowNewAnimalFields] = useState(false);

    // Handle farm input changes
    const handleFarmChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle animal input changes
    const handleAnimalChange = (e, index) => {
        const updatedAnimals = [...animals];
        updatedAnimals[index] = { ...updatedAnimals[index], [e.target.name]: e.target.value };
        setAnimals(updatedAnimals);
    };

    // Handle form submission for farm details
    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare animals data for submission
        const updatedAnimals = animals.map((animal) => {
            // Only include the id if it exists
            const { id, ...animalData } = animal;
            return id ? { id, ...animalData } : animalData;
        });

        router.put(`/farms/${farm.id}`, { ...formData, animals: updatedAnimals })
            .then(() => {
                // Reset new animal fields and hide input after successful submission
                setNewAnimal({ type_name: "", animal_number: "", years: "" });
                setShowNewAnimalFields(false);
            })
            .catch((error) => {
                console.error("Error updating farm:", error);
            });
    };

    // Handle deleting animals
    const handleDeleteAnimal = (index) => {
        const animalId = animals[index]?.id;
        if (animalId) {
            router.delete(`/animals/${animalId}`);
        }
        setAnimals(animals.filter((_, i) => i !== index)); // Remove from state
    };

    const [newAnimal, setNewAnimal] = useState({
        type_name: "",
        animal_number: "",
        years: "",
    });

    const handleNewAnimalChange = (e) => {
        setNewAnimal({ ...newAnimal, [e.target.name]: e.target.value });
    };

    // Add a new animal entry to the list
    const handleAddAnimal = () => {
        setAnimals([...animals, { ...newAnimal }]); // Add new animal to the list without an id
        setNewAnimal({ type_name: "", animal_number: "", years: "" }); // Clear input after adding
        setShowNewAnimalFields(false); // Hide input fields after adding
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8 mt-12">
            <div className="w-full fixed top-0 bg-white shadow-md p-4 flex justify-center">
                <NavBar auth={auth} />
            </div>
            <h2 className="text-3xl font-bold text-gray-700 my-6">Edit Farm Details</h2>

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

            {/* Farm Editing Form & Animal Display */}
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-700 mb-6 text-center text-blue-500">Farm Details</h3>

                {/* Farm Details */}
                <div className="grid grid-cols-[150px,1fr] gap-4 items-center border-b pb-6">
                    <label className="text-gray-600 font-semibold text-right">Farm Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFarmChange}
                        required
                        className="border p-2 w-full"
                    />

                    <label className="text-gray-600 font-semibold text-right">Email:</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleFarmChange}
                        required
                        className="border p-2 w-full"
                    />

                    <label className="text-gray-600 font-semibold text-right">Website:</label>
                    <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleFarmChange}
                        required
                        className="border p-2 w-full"
                    />
                </div>

                <div className="border-b pb-3">
                    <h3 className="text-xl font-bold text-gray-700 mt-3 text-center text-blue-500">Farm Animals</h3>
                    <div className="space-y-2 mt-4">
                        <div className="flex items-center justify-between">
                            <span className="flex-1 text-gray-600 font-semibold">Type:</span>
                            <span className="flex-1 text-gray-600 font-semibold">Number:</span>
                            <span className="flex-1 text-gray-600 font-semibold">Age:</span>
                        </div>

                        {/* Animal Editing */}
                        {animals.map((animal, index) => (
                            <div key={animal.id || index} className="flex items-center">
                                <select
                                    name="type_name"
                                    value={animal.type_name}
                                    onChange={(e) => handleAnimalChange(e, index)}
                                    className="flex-1 p-2 mr-2"
                                >
                                    <option hidden>{animal.type_name || "Select Animal"}</option>
                                    <option value="Sheep">Sheep</option>
                                    <option value="Cow">Cow</option>
                                    <option value="Chicken">Chicken</option>
                                    <option value="Horse">Horse</option>
                                    <option value="Pig">Pig</option>
                                </select>

                                <input
                                    type="text"
                                    name="animal_number"
                                    value={animal.animal_number}
                                    onChange={(e) => handleAnimalChange(e, index)}
                                    className="flex-1 p-2 mr-2"
                                    placeholder="Animal number"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    name="years"
                                    value={animal.years}
                                    onChange={(e) => handleAnimalChange(e, index)}
                                    className="flex-1 p-2 mr-2"
                                    placeholder="Animal age"
                                />

                                <button
                                    type="button"
                                    onClick={() => handleDeleteAnimal(index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add a new animal */}
                    <div className="text-left mt-4">
                        {animals.length < 3 ? (
                            <>
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
                                            Add Animal
                                        </button>
                                    </div>
                                )}
                                <div className={`${showNewAnimalFields ? "bg-blue-100" : "bg-white-100"} px-2 pb-2 text-center`}>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewAnimalFields(!showNewAnimalFields)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        {showNewAnimalFields ? "Cancel" : "+ Add Animal"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="alert alert-warning p-4 bg-orange-300 text-white text-left mb-4 max-w-2xl w-full">
                                Maximum number of farm animals reached.
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center mt-6">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                        Update Farm
                    </button>
                </div>
            </form>

            <div className="mt-6 flex text-left max-w-2xl w-full">
                <Link href={`/farms/${farm.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Back to Farm
                </Link>
            </div>
        </div>
    );
}
