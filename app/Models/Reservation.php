<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model {
    protected $fillable = ['user_id', 'bus_id', 'heure', 'description', 'status'];

    public function user() { return $this->belongsTo(User::class); }
    public function bus()  { return $this->belongsTo(Bus::class)->with(['chauffeur', 'heure', 'trajet']); }
}