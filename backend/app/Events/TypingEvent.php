<?php
// app/Events/TypingEvent.php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TypingEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $sender_id;
    public $recipient_id;
    public $is_typing;

    public function __construct($sender_id, $recipient_id, $is_typing)
    {
        $this->sender_id = $sender_id;
        $this->recipient_id = $recipient_id;
        $this->is_typing = $is_typing;
    }

    public function broadcastOn()
    {
        return new Channel('chat.' . $this->recipient_id);
    }

    public function broadcastAs()
    {
        return 'typing';
    }

    public function broadcastWith()
    {
        return [
            'sender_id' => $this->sender_id,
            'is_typing' => $this->is_typing,
        ];
    }
}
