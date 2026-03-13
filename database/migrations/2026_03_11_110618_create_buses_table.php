<?php
// database/migrations/2026_03_11_110640_create_buses_table.php
// REMPLACER COMPLET

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('buses', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->foreignId('chauffeur_id')->constrained('chauffeurs')->onDelete('cascade');
    $table->integer('nombre_places');
    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('buses');
    }
};