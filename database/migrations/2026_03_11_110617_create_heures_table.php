<?php
// database/migrations/2024_01_01_000004_create_heures_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('heures', function (Blueprint $table) {
            $table->id();
            $table->json('liste_heures'); // ex: ["07:00","09:30","13:00"]
            $table->string('label')->nullable(); // ex: "Matin", "Après-midi"
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('heures');
    }
};