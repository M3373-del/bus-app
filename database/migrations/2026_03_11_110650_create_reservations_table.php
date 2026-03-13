<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('bus_id')->constrained('buses')->onDelete('cascade');
            $table->string('heure');
            $table->string('description')->nullable();
            $table->enum('status', ['confirmed', 'waiting'])->default('confirmed');
            $table->unique(['user_id', 'bus_id']); // user ma yzidch reservation f nafs bus
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('reservations'); }
};