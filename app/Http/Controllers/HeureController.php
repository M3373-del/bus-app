<?php
namespace App\Http\Controllers;
use App\Models\Heure;
use Illuminate\Http\Request;

class HeureController extends Controller {
    public function index() { return response()->json(Heure::all()); }

    public function store(Request $request) {
        $request->validate(['label' => 'required|string', 'liste_heures' => 'required|array|min:1']);
        Heure::create($request->only(['label','liste_heures']));
        return redirect()->back();
    }

    public function update(Request $request, Heure $heure) {
        $heure->update($request->only(['label','liste_heures']));
        return redirect()->back();
    }

    public function destroy(Heure $heure) {
        $heure->delete();
        return redirect()->back();
    }
}