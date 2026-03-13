<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;

class StaffOnly
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check() && auth()->user()->role === 'staff') {
            return $next($request);
        }
        return response()->json(['message' => 'Accès réservé au staff.'], 403);
    }
}