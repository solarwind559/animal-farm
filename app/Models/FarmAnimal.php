<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FarmAnimal extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'animal_number',
        'type_name',
        'years',
        'farm_id'
    ];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
}
