<?php

namespace Database\Factories;

use App\Models\Farm;
use App\Models\FarmAnimal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Animal>
 */
class FarmAnimalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = FarmAnimal::class;

    public function definition(): array
    {
        return [
            //
            'animal_number' => fake()->unique()->numberBetween(1000000000, 9999999999),
            'type_name' => $this->faker->randomElement(['Cow', 'Sheep', 'Horse', 'Pig', 'Chicken']),
            'years' => $this->faker->numberBetween(1, 12),
            'farm_id' => Farm::factory(), // Links animal to a farm
        ];
    }
}
