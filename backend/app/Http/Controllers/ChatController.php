<?php

namespace App\Http\Controllers;

use App\Models\Messagem;
use Illuminate\Http\Request;
use App\Events\Message;
use App\Events\TypingEvent;
use App\Events\NotificationSent;
use App\Events\MessageSent;



class ChatController extends Controller
{
    public function message(Request $request)
    {
        $validatedData = $request->validate([
            'content' => 'required|string',
            'sender_id' => 'required|exists:users,id',
            'recipient_id' => 'required|exists:users,id',
        ]);
    
        $message = Messagem::create([
            'content' => $validatedData['content'],
            'sender_id' => $validatedData['sender_id'],
            'recipient_id' => $validatedData['recipient_id'],
        ]);
    
        // Broadcast the message
        event(new Message($message->sender_id, $message->recipient_id, $message->content));
    
        // Broadcast a notification to the recipient
        event(new NotificationSent('You have a new message!', $validatedData['recipient_id']));
    
        return response()->json(['success' => true, 'message' => 'Message sent and stored successfully.']);
    }
    

    

    public function getMessages($userId, $selectedUserId)
    {
        $messages = Messagem::where(function ($query) use ($userId, $selectedUserId) {
            $query->where('sender_id', $userId)->where('recipient_id', $selectedUserId);
        })->orWhere(function ($query) use ($userId, $selectedUserId) {
            $query->where('sender_id', $selectedUserId)->where('recipient_id', $userId);
        })->orderBy('created_at')->get();
    
        return response()->json($messages);
    }
    
    
// app/Http/Controllers/MessageController.php
public function getUnreadMessages($userId)
{
    $unreadMessages = Messagem::where('recipient_id', $userId)
        ->whereNull('seen_at')
        ->groupBy('sender_id')
        ->selectRaw('sender_id, count(*) as count')
        ->get()
        ->pluck('count', 'sender_id');

    return response()->json($unreadMessages);
}

public function notification(Request $request)
{
    $validatedData = $request->validate([
        'message' => 'required|string',
        'recipient_id' => 'required|exists:users,id',
    ]);

    event(new NotificationSent($validatedData['message'], $validatedData['recipient_id']));

    return response()->json(['status' => 'Notification sent!']);
}


}

