<?php

namespace Database\Seeders;

use App\Models\Farm;
use App\Models\FarmAnimal;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class FarmAnimalsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        foreach (Farm::all() as $farm) {
            FarmAnimal::factory()->count(3)->create(['farm_id' => $farm->id]);
        }
    }
}
