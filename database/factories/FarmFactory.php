<?php

namespace Database\Factories;

use App\Models\Farm;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Farm>
 */
class FarmFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Farm::class;

    public function definition(): array
    {
        return [
            //
            'name' => $this->faker->randomElement(['Farm']) . ' ' . $this->faker->company(),
            'email' => $this->faker->unique()->safeEmail(),
            'website' => 'http://www.' . $this->faker->domainName(),
            'user_id' => User::factory(),
        ];
    }
}
