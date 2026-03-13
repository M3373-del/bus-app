<?php
namespace App\Http\Controllers;
use App\Models\Bus;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BusController extends Controller {

    public function index() {
        $now = Carbon::now();
        $buses = Bus::with(['chauffeur', 'heure', 'trajet'])
            ->withCount(['reservations as confirmed_count' => fn($q) => $q->where('status','confirmed')])
            ->get()
            ->filter(function($bus) use ($now) {
                $heures = $bus->heure?->liste_heures ?? [];
                return collect($heures)->contains(function($h) use ($now) {
                    $depart = Carbon::today()->setTimeFromTimeString($h);
                    $minutes = $depart->diffInMinutes($now, false);
                    // bus يتلاع: départ في المستقبل و window مفتوحة (أقل من 60 دقيقة)
                    return $minutes > 0 && $minutes <= 60;
                });
            })->values();
        return response()->json($buses);
    }

    public function all() {
        return response()->json(Bus::with(['chauffeur','heure','trajet'])
            ->withCount(['reservations as confirmed_count' => fn($q) => $q->where('status','confirmed')])
            ->get());
    }

    public function store(Request $request) {
        $request->validate([
            'name'          => 'required|string',
            'nombre_places' => 'required|integer|min:1',
            'chauffeur_id'  => 'required|exists:chauffeurs,id',
            'heure_id'      => 'required|exists:heures,id',
        ]);
        Bus::create($request->only(['name','nombre_places','chauffeur_id','heure_id']));
        return redirect()->back();
    }

    public function update(Request $request, Bus $bus) {
        $bus->update($request->only(['name','nombre_places','chauffeur_id','heure_id']));
        return redirect()->back();
    }

    public function destroy(Bus $bus) {
        $bus->delete();
        return redirect()->back();
    }
}