<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Event for broadcasting when a message is seen
class MessageSeen implements ShouldBroadcast
{
    public $userId;
    public $recipientId;
    public $messageId;

    public function __construct($userId, $recipientId, $messageId)
    {
        $this->userId = $userId;
        $this->recipientId = $recipientId;
        $this->messageId = $messageId;
    }

    public function broadcastOn()
    {
        return new Channel('chat');
    }

    public function broadcastWith()
    {
        return [
            'sender_id' => $this->userId,
            'recipient_id' => $this->recipientId,
            'message_id' => $this->messageId,
            'seen_at' => now()
        ];
    }
}
