<?php

use Tests\TestCase;
use App\Models\Farm;
use App\Models\User;
use App\Models\FarmAnimal;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FarmControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate'); // migrations run before tests
    }

    /** @test */
    public function creates_a_farm_with_animals_successfully()
    {
        $user = User::factory()->create();
        Auth::loginUsingId($user->id);

        $response = $this->post('/farms', [
            'name' => 'Sunny Farm',
            'email' => 'farm@example.com',
            'website' => 'https://sunnyfarm.com',
            'animals' => [
                ['animal_number' => 101, 'type_name' => 'Cow', 'years' => 5],
                ['animal_number' => 102, 'type_name' => 'Sheep', 'years' => 3]
            ]
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('farms', ['user_id' => $user->id]);
    }

    /** @test */
    public function fails_to_create_a_farm_if_email_is_not_unique()
    {

    }

    /** @test */
    public function updates_farm_details_successfully()
    {

    }

    /** @test */
    public function deletes_a_farm_successfully()
    {
        $farm = Farm::factory()->create();

        $response = $this->delete("/farms/{$farm->id}");

        $response->assertRedirect();
        $this->assertSoftDeleted('farms', ['id' => $farm->id]);
    }
}
