<?php
namespace App\Http\Controllers;
use App\Models\Chauffeur;
use Illuminate\Http\Request;

class ChauffeurController extends Controller {
    public function index() { return response()->json(Chauffeur::all()); }

    public function store(Request $request) {
        $request->validate(['name' => 'required|string']);
        Chauffeur::create($request->only(['name','phone','cin']));
        return redirect()->back();
    }

    public function update(Request $request, Chauffeur $chauffeur) {
        $chauffeur->update($request->only(['name','phone','cin']));
        return redirect()->back();
    }

    public function destroy(Chauffeur $chauffeur) {
        $chauffeur->delete();
        return redirect()->back();
    }
}