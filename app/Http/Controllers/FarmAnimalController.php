<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use Inertia\Inertia;
use App\Models\FarmAnimal;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class FarmAnimalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Inertia::render('Animals/Animals', [
            'animals' => FarmAnimal::whereHas('farm', function ($query) {
                    $query->where('user_id', Auth::id()); // Only fetch animals from user's farms
                })
                ->with('farm')
                ->paginate(10),
            'title' => 'Animal List',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Fetch farms owned by the authenticated user
        $farms = Farm::where('user_id', Auth::id())->get();

        return Inertia::render('Animals/AnimalCreate', [
            'farms' => $farms,
            'title' => 'Create Animal',
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'animal_number' => 'required|integer|min:0|unique:farm_animals,animal_number',
            'type_name' => 'required|string',
            'years' => 'nullable|integer|min:0|max:20',
            'farm_id' => 'required|exists:farms,id',
        ]);

        // Check if the selected farm already has 3 animals
        $farm = Farm::find($validated['farm_id']);
        if ($farm->animals()->count() >= 3) {
            // return redirect()->back()->withErrors(['farm_id' => 'This farm already has the maximum number of animals (3 animals)']);
            return redirect()->back()->withErrors(['farm_id' => 'This farm already has the maximum number of animals (3 animals)'])->withInput();

        }


        // Create new animal
        $animal = FarmAnimal::create([
            'user_id' => Auth::id(), // Ensure it belongs to the logged-in user
            'animal_number' => $validated['animal_number'],
            'type_name' => $validated['type_name'],
            'years' => $validated['years'] ?? null,
            'farm_id' => $validated['farm_id'],
        ]);

        return redirect("/animals/{$animal->id}")->with('success', 'Animal created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $animal = FarmAnimal::with('farm')->findOrFail($id);

        return Inertia::render('Animals/AnimalDetail', [
            'animal' => $animal,
            'title' => 'Animal Details',
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Find the animal and make sure it belongs to a farm owned by the authenticated user
        $animal = FarmAnimal::whereHas('farm', function ($query) {
            $query->where('user_id', Auth::id());
        })->findOrFail($id);

        return Inertia::render('Animals/AnimalEdit', [
            'auth' => ['user' => auth()->user()],
            'animal' => $animal,
            'farms' => Farm::all(),
            'title' => 'Edit Animal',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate the request data
        $validated = $request->validate([
            'animal_number' => 'required|unique:farm_animals,animal_number,' . $id,
            'type_name' => 'required|string',
            'years' => 'nullable|integer|min:0|max:20',
            'farm_id' => 'required|exists:farms,id',
        ]);

        // Find the animal and ensure it belongs to a farm owned by the authenticated user
        $animal = FarmAnimal::whereHas('farm', function ($query) {
            $query->where('user_id', Auth::id());
        })->findOrFail($id);

        // Check if the new farm has reached the max limit of 3 animals
        if ($animal->farm_id !== $validated['farm_id']) { // Only check if farm is changing
            $newFarm = Farm::findOrFail($validated['farm_id']);
            if ($newFarm->animals()->count() >= 3) {
                return redirect()->back()->withErrors(['farm_id' => 'This farm already has the maximum number of animals (3).']);
            }
        }

        // Update the animal with validated data
        $animal->update($validated);

        return redirect("/animals/{$animal->id}")->with('success', 'Animal updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Find the animal by its ID and make sure it belongs to a farm that the user owns
        $animal = FarmAnimal::whereHas('farm', function ($query) {
            $query->where('user_id', Auth::id());
        })->findOrFail($id);

        $animal->delete();

        return redirect()->back()->with('success', 'Animal deleted successfully!');

    }

}
