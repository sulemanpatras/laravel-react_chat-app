<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Message implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $sender_id;
    public $recipient_id;
    public $content;

    public function __construct($sender_id, $recipient_id, $content)
    {
        $this->sender_id = $sender_id;
        $this->recipient_id = $recipient_id;
        $this->content = $content;
    }

    public function broadcastOn()
    {
        return new Channel('chat');
    }

    public function broadcastAs()
    {
        return 'message';
    }

    public function broadcastWith()
    {
        return [
            'sender_id' => $this->sender_id,
            'recipient_id' => $this->recipient_id,
            'content' => $this->content,
        ];
    }
}
