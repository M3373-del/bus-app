<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('trajets', function (Blueprint $table) {
    $table->id();
    $table->foreignId('bus_id')->constrained('buses')->onDelete('cascade'); // foreign key
    $table->string('arrets'); // ex: "A,B,C,D"
    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('trajets');
    }
};