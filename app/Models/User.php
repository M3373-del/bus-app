<?php
// ============================================================
// app/Models/User.php  — REMPLACER le fichier existant
// ============================================================
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role'];
    protected $hidden   = ['password', 'remember_token'];
    protected $casts    = ['email_verified_at' => 'datetime', 'password' => 'hashed'];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function isStaff(): bool
    {
        return $this->role === 'staff';
    }
}