<?php
use Tests\TestCase;
use App\Models\Farm;
use App\Models\User;
use App\Models\FarmAnimal;
use Illuminate\Support\Facades\Auth;
use Inertia\Testing\AssertableInertia;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FarmAnimalControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_fetches_animals_belonging_to_authenticated_user()
    {

    }

    /** @test */
    public function creates_an_animal_successfully()
    {
        $user = User::factory()->create();
        Auth::login($user);
        $farm = Farm::factory()->create(['user_id' => $user->id]);

        $response = $this->post('/animals', [
            'animal_number' => 101,
            'type_name' => 'Cow',
            'years' => 5,
            'farm_id' => $farm->id
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('farm_animals', ['animal_number' => 101, 'farm_id' => $farm->id]);
    }

    /** @test */
    public function fails_to_create_an_animal_if_farm_has_maximum_animals()
    {

    }

    /** @test */
    public function updates_an_animal_successfully()
    {

    }

    /** @test */
    public function deletes_an_animal_successfully()
    {
        $farm = Farm::factory()->create();
        $animal = FarmAnimal::factory()->create(['farm_id' => $farm->id]);

        $response = $this->delete("/animals/{$animal->id}");

        $response->assertRedirect();
        $this->assertSoftDeleted('farm_animals', ['id' => $animal->id]);
    }

}
