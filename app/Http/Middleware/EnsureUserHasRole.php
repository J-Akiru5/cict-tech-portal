<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureUserHasRole Middleware
 * 
 * Checks if the authenticated user has the required role(s).
 * Usage: Route::middleware('role:admin') or Route::middleware('role:admin,officer')
 */
class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  One or more role names (comma-separated in route definition)
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Check if user has any of the required roles (using Spatie)
        if (!$request->user()->hasAnyRole($roles)) {
            // User doesn't have the required role
            abort(403, 'You do not have permission to access this page.');
        }

        return $next($request);
    }
}
