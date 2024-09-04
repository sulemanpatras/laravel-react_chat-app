<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Broadcast::channel('chat.{recipient_id}', function ($user, $recipient_id) {
            return (int) $user->id === (int) $recipient_id;
        });
        

        require base_path('routes/channels.php');
    }
}