<?php

namespace App\Listeners;

use App\Events\MessageSeen;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class BroadcastMessageSeen implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     *
     * @param  \App\Events\MessageSeen  $event
     * @return void
     */
    public function handle(MessageSeen $event)
    {
        broadcast(new MessageSeen($event->senderId, $event->recipientId, $event->messageId));
    }
}

