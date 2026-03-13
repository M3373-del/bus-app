<?php
namespace App\Http\Controllers;
use App\Models\Trajet;
use Illuminate\Http\Request;

class TrajetController extends Controller {
    public function store(Request $request) {
        $request->validate([
            'bus_id' => 'required|exists:buses,id|unique:trajets,bus_id',
            'arrets' => 'required|array|min:1',
        ]);
        Trajet::create($request->only(['bus_id','arrets']));
        return redirect()->back();
    }

    public function update(Request $request, Trajet $trajet) {
        $request->validate(['arrets' => 'required|array|min:1']);
        $trajet->update(['arrets' => $request->arrets]);
        return redirect()->back();
    }

    public function destroy(Trajet $trajet) {
        $trajet->delete();
        return redirect()->back();
    }
}