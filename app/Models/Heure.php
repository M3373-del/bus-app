<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Heure extends Model {
    protected $fillable = ['label', 'liste_heures'];
    protected $casts    = ['liste_heures' => 'array'];
    public function buses() { return $this->hasMany(Bus::class); }
}