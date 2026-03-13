<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Chauffeur extends Model {
    protected $fillable = ['name', 'phone', 'cin'];
    public function bus() { return $this->hasOne(Bus::class); }
}