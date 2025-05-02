<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FarmAnimalController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {

    //DASHBOARD:
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    //PROFILE:
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //CRUD ANIMALS:
    Route::get('/animals', [FarmAnimalController::class, 'index']);
    Route::get('/animals/{id}', [FarmAnimalController::class, 'show']);
    Route::post('/animals', [FarmAnimalController::class, 'store']);
    Route::get('/animals/{id}/edit', [FarmAnimalController::class, 'edit']);
    Route::put('/animals/{id}', [FarmAnimalController::class, 'update']);
    Route::delete('/animals/{id}', [FarmAnimalController::class, 'destroy']);
    Route::get('/create-animal', [FarmAnimalController::class, 'create'])->name('animals.create');

    //CRUD FARMS:
    Route::get('/farms', [FarmController::class, 'index']);
    Route::get('/farms/{id}', [FarmController::class, 'show']);
    Route::post('/farms', [FarmController::class, 'store']);
    Route::get('/farms/{id}/edit', [FarmController::class, 'edit'])->name('farm.edit');
    Route::put('/farms/{id}', [FarmController::class, 'update']);
    Route::delete('/farms/{id}', [FarmController::class, 'destroy']);
    Route::get('/create-farm', [FarmController::class, 'create']);

});

Route::post('/logout', function () {
    Auth::logout();
    return redirect('/');
})->name('logout');

require __DIR__.'/auth.php';
