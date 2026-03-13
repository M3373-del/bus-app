<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Bus extends Model {
    protected $fillable = ['name', 'nombre_places', 'chauffeur_id', 'heure_id'];

    public function chauffeur() { return $this->belongsTo(Chauffeur::class); }
    public function heure()     { return $this->belongsTo(Heure::class); }
    public function trajets()    { return $this->hasMany(Trajet::class); }
    public function reservations() { return $this->hasMany(Reservation::class); }
}