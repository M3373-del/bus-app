<?php
namespace App\Http\Controllers;
use App\Models\Bus;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReservationController extends Controller {

    public function store(Request $request, Bus $bus) {
        $request->validate([
            'heure'       => 'required|string',
            'description' => 'nullable|string|max:255',
        ]);

        $now    = Carbon::now();
        $depart = Carbon::today()->setTimeFromTimeString($request->heure);

        $minutesAvant = $depart->diffInMinutes($now, false); // positif = départ dans le futur

        // départ déjà passé
        if ($minutesAvant <= 0) {
            return back()->withErrors(['heure' => 'Ce départ est déjà passé.']);
        }

        // trop tôt — réservation pas encore ouverte (plus d'1h avant départ)
        if ($minutesAvant > 60) {
            $ouverture = $depart->copy()->subHour()->format('H:i');
            return back()->withErrors(['heure' => "Réservation ouvre à {$ouverture}."]);
        }

        // déjà réservé ce bus
        $exists = Reservation::where('user_id', auth()->id())->where('bus_id', $bus->id)->exists();
        if ($exists) {
            return back()->withErrors(['heure' => 'Vous avez déjà réservé ce bus.']);
        }

        $confirmed = Reservation::where('bus_id', $bus->id)->where('status','confirmed')->count();
        $status = $confirmed >= $bus->nombre_places ? 'waiting' : 'confirmed';

        Reservation::create([
            'user_id'     => auth()->id(),
            'bus_id'      => $bus->id,
            'heure'       => $request->heure,
            'description' => $request->description,
            'status'      => $status,
        ]);

        return redirect()->back();
    }

    public function myReservations() {
        return response()->json(
            Reservation::where('user_id', auth()->id())
                ->with(['bus.chauffeur','bus.heure','bus.trajet'])
                ->latest()->get()
        );
    }

    public function destroy(Reservation $reservation) {
        if ($reservation->user_id !== auth()->id()) {
            return back()->withErrors(['message' => 'Non autorisé']);
        }
        $bus_id = $reservation->bus_id;
        $reservation->delete();

        $waiting = Reservation::where('bus_id', $bus_id)->where('status','waiting')->oldest()->first();
        if ($waiting) $waiting->update(['status' => 'confirmed']);

        return redirect()->back();
    }
}