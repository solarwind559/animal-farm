<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        // $farm = Farm::where('user_id', Auth::id())->first();
        // return Inertia::render('Dashboard', ['farm' => $farm]);
        $farms = Farm::where('user_id', Auth::id())->get(); // ✅ Fetch farms owned by the user

        return Inertia::render('Dashboard', [
            'farms' => $farms ?? [], // ✅ Ensure `farms` is always an array
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
