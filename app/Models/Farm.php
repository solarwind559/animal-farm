<?php

namespace App\Models;

use App\Models\FarmAnimal;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Farm extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'website',
        'user_id'
    ];

    // public function animals()
    // {
    //     return $this->hasMany(FarmAnimal::class);
    // }

    public function animals()
{
    return $this->hasMany(FarmAnimal::class, 'farm_id');
}

}
