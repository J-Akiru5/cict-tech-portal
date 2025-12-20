<?php

use App\Http\Controllers\AIController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| AI Routes
|--------------------------------------------------------------------------
*/

Route::prefix('ai')->name('api.ai.')->group(function () {
    // Status check (no auth required)
    Route::get('/status', [AIController::class, 'status'])->name('status');

    // Protected AI endpoints
    Route::middleware(['web'])->group(function () {
        Route::post('/chat', [AIController::class, 'chat'])->name('chat');
        Route::post('/generate', [AIController::class, 'generate'])->name('generate');
        Route::post('/summarize', [AIController::class, 'summarize'])->name('summarize');
        Route::get('/search', [AIController::class, 'search'])->name('search');
    });
});
