<?php
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BusController;
use App\Http\Controllers\ChauffeurController;
use App\Http\Controllers\TrajetController;
use App\Http\Controllers\HeureController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('Welcome'));

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    // Buses
    Route::get('/buses',            [BusController::class, 'index']);  // student (filtered)
    Route::get('/buses/all',        [BusController::class, 'all']);    // staff (all)
    Route::post('/buses',           [BusController::class, 'store']);
    Route::put('/buses/{bus}',      [BusController::class, 'update']);
    Route::delete('/buses/{bus}',   [BusController::class, 'destroy']);

    // Trajets (arrêts)
    Route::post('/trajets',              [TrajetController::class, 'store']);
    Route::put('/trajets/{trajet}',      [TrajetController::class, 'update']);
    Route::delete('/trajets/{trajet}',   [TrajetController::class, 'destroy']);

    // Chauffeurs
    Route::get('/chauffeurs',                [ChauffeurController::class, 'index']);
    Route::post('/chauffeurs',               [ChauffeurController::class, 'store']);
    Route::put('/chauffeurs/{chauffeur}',    [ChauffeurController::class, 'update']);
    Route::delete('/chauffeurs/{chauffeur}', [ChauffeurController::class, 'destroy']);

    // Heures
    Route::get('/heures',             [HeureController::class, 'index']);
    Route::post('/heures',            [HeureController::class, 'store']);
    Route::put('/heures/{heure}',     [HeureController::class, 'update']);
    Route::delete('/heures/{heure}',  [HeureController::class, 'destroy']);

    // Reservations
    Route::post('/buses/{bus}/reserve',          [ReservationController::class, 'store']);
    Route::get('/my-reservations',               [ReservationController::class, 'myReservations']);
    Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);

    // Profile
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';