<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\UserController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/



Route::middleware('auth:sanctum')->group(function () {
    Route::post('messages', [ChatController::class, 'message']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/allusers', [UserController::class, 'allusers']);
});


Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/notification', [ChatController::class, 'notification']);
Route::post('/sentnoti', [ChatController::class, 'sentnoti']);
Route::get('messages/{userId}/{selectedUserId}', [ChatController::class, 'getMessages']);
Route::get('/unread-messages/{userId}', [ChatController::class, 'getUnreadMessages']);
