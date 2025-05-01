<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\FarmsSeeder;
use Database\Seeders\UsersSeeder;
use Database\Seeders\FarmAnimalsSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            UsersSeeder::class,
            FarmsSeeder::class,
            FarmAnimalsSeeder::class,
        ]);
    }
}
