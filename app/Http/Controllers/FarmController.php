<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use Inertia\Inertia;
use App\Models\FarmAnimal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class FarmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Inertia::render('Farms/Farms', [
            'farms' => Farm::with('animals')
                ->where('user_id', Auth::id()) // ✅ Only fetch farms owned by the logged-in user
                ->paginate(10),
            'title' => 'Farm List',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        // return Inertia::render('Farms/FarmCreate',
        //     [
        //         'title' => 'Create Farm',
        //     ]);

        $farms = Farm::where('user_id', Auth::id())->get();

        return Inertia::render('Farms/FarmCreate', [
            'farms' => $farms,
            'title' => 'Create Farm',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate both the farm and its animals
        $validatedData = $request->validate([
            'name' => 'required|string',
            'website' => 'nullable|url',
            'email' => 'required|email|unique:farms,email',
            'animals' => 'nullable|array',
            'animals.*.animal_number' => 'required|integer',
            'animals.*.type_name' => 'required|string',
            'animals.*.years' => 'nullable|integer|min:0|max:20',
        ]);

        DB::beginTransaction(); // Start transaction

        try {
            // Step 1: Create the farm
            $farm = Farm::create([
                'name' => $validatedData['name'],
                'website' => $validatedData['website'],
                'email' => $validatedData['email'],
                'user_id' => Auth::id(),
            ]);

            // Step 2: Store related animals
            foreach ($validatedData['animals'] as $animalData) {
                FarmAnimal::create([
                    'farm_id' => $farm->id,
                    'animal_number' => $animalData['animal_number'],
                    'type_name' => $animalData['type_name'],
                    'years' => $animalData['years'],
                ]);
            }

            DB::commit(); // Commit transaction

            return redirect("/farms/{$farm->id}/")->with('success', 'New farm created successfully!');
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction
            // Log::error('Farm creation failed:', ['error' => $e->getMessage()]);
            if ($e->getCode() == 23000) { // Integrity constraint violation
                return redirect()->back()->with('error', 'An animal with this number already exists in the farm.');
            }
            return redirect()->back()->with('error', 'Something went wrong. Please try again.');
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $farm = Farm::with('animals')->findOrFail($id);

        return Inertia::render('Farms/FarmDetail', [
            'farm' => $farm,
            'title' => 'Farm Details',
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
        $farm = Farm::where('user_id', Auth::id())->with('animals')->findOrFail($id); // ✅ Ensure animals are included
        return Inertia::render('Farms/FarmEdit', [
            'farm' => $farm,
            'title' => 'Farm Edit',

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Retrieve the farm
        // $farm = Farm::where('user_id', Auth::id())->findOrFail($id);
        Log::info("Updating farm with ID: $id");
        $farm = Farm::where('user_id', Auth::id())->findOrFail($id);
        Log::info("Farm found:", ['farm' => $farm]);

        // Validate farm details including email
        $validatedFarm = $request->validate([
            'name' => 'required|string',
            'website' => 'nullable|url',
            'email' => [
                'required',
                'regex:/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/',
                'unique:farms,email,' . $farm->id
            ],
        ]);

        // Validate each animal inside the request
        $validatedAnimals = $request->validate([
            'animals' => 'array',
            'animals.*.id' => 'nullable|integer|exists:farm_animals,id',
            'animals.*.animal_number' => 'required|integer',
            'animals.*.type_name' => 'required|string',
            'animals.*.years' => 'nullable|integer',
        ]);

        // If no animals exist in request, log an error
        if (empty($validatedAnimals['animals'])) {
            return redirect()->back()->with('error', 'No animals found in request.');
        }

        DB::beginTransaction(); // Start transaction

        try {
            // Manually update farm details
            $farm->name = $validatedFarm['name'];
            $farm->website = $validatedFarm['website'];
            $farm->email = $validatedFarm['email']; // Update email
            $farm->save();

            // Enable query logging

            // Iterate through each animal and update
            foreach ($validatedAnimals['animals'] as $animalData) {
                // Check if an ID exists (existing animal) or create a new one
                if (!isset($animalData['id'])) {
                    $animal = FarmAnimal::create([
                        'farm_id' => $farm->id,
                        'animal_number' => $animalData['animal_number'],
                        'type_name' => $animalData['type_name'],
                        'years' => (int) $animalData['years'],
                    ]);
                } else {
                    $animal = FarmAnimal::where('farm_id', $farm->id)->where('id', $animalData['id'])->first();
                    if (!$animal) {
                        continue;
                    }

                    // Update existing animal
                    $animal->animal_number = $animalData['animal_number'];
                    $animal->type_name = $animalData['type_name'];
                    $animal->years = (int) $animalData['years'];
                    $animal->save();
                }
            }


            DB::commit(); // Commit changes to database

            return redirect("/farms/{$farm->id}")->with('success', 'Farm details updated successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Update failed: ' . $e->getMessage());

        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $farm = Farm::where('user_id', Auth::id())->findOrFail($id);
        $farm->delete();

        return redirect()->back()->with('success', 'Farm deleted successfully!');
    }
}
