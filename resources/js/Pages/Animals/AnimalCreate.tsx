import { useState, useEffect } from "react";
import { usePage, router, Link, Head } from "@inertiajs/react";
import NavBar from "../../Components/NavBar";

type Farm = {
    id: number;
    name: string;
};

type AnimalDetails = {
    farm_id: string;
    type_name: string;
    animal_number: string;
    years?: number;
};

type ValidationErrors = Record<string, string>;

type FlashMessages = {
    success?: string;
    error?: string
};
type AuthProps = {
    user?:
    { id: number; name: string } | null
};
type PageProps = {
    auth: AuthProps;
    farms: Farm[];
    flash?: FlashMessages;
    errors?: ValidationErrors;
    title: string;
};

export default function AnimalCreate({ auth }: PageProps) {
    const { farms = [], title, flash, errors = {} } = usePage<PageProps>().props;

    const [animalDetails, setAnimalDetails] = useState<AnimalDetails>({
        farm_id: "",
        type_name: "",
        animal_number: "",
        years: undefined,
    });

    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        setValidationErrors(errors);
    }, [errors]);

    const handleAnimalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAnimalDetails({ ...animalDetails, [e.target.name]: e.target.value });

        // Clear only the current field's error
        setValidationErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[e.target.name];
            return updatedErrors;
        });
    };

    const validate = (): ValidationErrors => {
        const errors: ValidationErrors = {};
        if (!animalDetails.farm_id) errors.farm_id = "Farm selection is required";
        if (!animalDetails.type_name) errors.type_name = "Animal type selection is required";
        if (!animalDetails.animal_number) errors.animal_number = "Animal number is required";
        if (animalDetails.years !== undefined && (animalDetails.years < 0 || animalDetails.years > 20)) {
            errors.years = "Age must be between 0 and 20";
        }
        return errors;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            router.post("/animals", animalDetails);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8 mt-12">

            <Head title={title || "Laravel"} />

            <div className="w-full fixed top-0 bg-white shadow-md p-4 flex justify-center">
                <NavBar auth={auth} />
            </div>

            <h2 className="text-3xl font-bold text-gray-700 my-6">Create Animal</h2>

            {Object.keys(errors).length > 0 && (
                <div className="alert alert-danger p-4 bg-red-400 text-white text-left mb-4 max-w-2xl w-full">
                    {Object.values(errors).map((msg, index) => (
                        <p key={index}>{msg}</p>
                    ))}
                </div>
            )}

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

            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-6 shadow-lg space-y-6">

                {/* Farm Selection */}
                <div className="grid grid-cols-[150px,1fr] gap-4 items-top">
                    <label className="text-gray-600 font-semibold text-right">Farm*:</label>
                    <div className="flex flex-col">
                        <select
                            name="farm_id"
                            value={animalDetails.farm_id}
                            onChange={handleAnimalChange}
                            className="p-2 border w-full"
                        >
                            <option value="" hidden>Select Farm</option>
                            {farms.map((farm) => (
                                <option key={farm.id} value={farm.id}>{farm.name}</option>
                            ))}
                        </select>
                        <div className="min-h-[20px]">
                            {validationErrors.farm_id && <span className="text-red-500 mt-2">{validationErrors.farm_id}</span>}
                        </div>
                    </div>
                </div>

                {/* Animal Type */}
                <div className="grid grid-cols-[150px,1fr] gap-4 items-top">
                    <label className="text-gray-600 font-semibold text-right">Animal Type*:</label>
                    <div className="flex flex-col">
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
                        <div className="min-h-[20px]">
                            {validationErrors.type_name && <span className="text-red-500 mt-2">{validationErrors.type_name}</span>}
                        </div>
                    </div>
                </div>

                {/* Animal Number */}
                <div className="grid grid-cols-[150px,1fr] gap-4 items-top">
                    <label className="text-gray-600 font-semibold text-right">Animal Number*:</label>
                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="animal_number"
                            value={animalDetails.animal_number}
                            onChange={handleAnimalChange}
                            placeholder="Animal number"
                            className="p-2 border w-full"
                        />
                        <div className="min-h-[20px]">
                            {validationErrors.animal_number && <span className="text-red-500 mt-2">{validationErrors.animal_number}</span>}
                        </div>
                    </div>
                </div>

                {/* Animal Age */}
                <div className="grid grid-cols-[150px,1fr] gap-4 items-top">
                    <label className="text-gray-600 font-semibold text-right">Age (optional):</label>
                    <div className="flex flex-col">
                        <input
                            type="number"
                            min="0"
                            max="20"
                            name="years"
                            value={animalDetails.years ?? ""}
                            onChange={handleAnimalChange}
                            placeholder="Animal age"
                            className="p-2 border w-full"
                        />
                        <div className="min-h-[20px]">
                            {validationErrors.years && <span className="text-red-500 mt-2">{validationErrors.years}</span>}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-6">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                        Save Animal
                    </button>
                </div>
            </form>
        </div>
    );
}
