<?php

namespace App\Http\Controllers;

use App\Models\Messagem;
use Illuminate\Http\Request;
use App\Events\Message;

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

        event(new Message($message->sender_id, $message->recipient_id, $message->content));

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

public function markAsSeen(Request $request)
{
    $validatedData = $request->validate([
        'message_id' => 'required|exists:messages,id',
    ]);

    $message = Messagem::find($validatedData['message_id']);
    $message->seen_at = now();
    $message->save();

    return response()->json(['success' => true]);
}

// app/Http/Controllers/MessageController.php
public function getUnreadMessages($userId)
{
    $unreadMessages = Message::where('recipient_id', $userId)
        ->whereNull('seen_at')
        ->groupBy('sender_id')
        ->selectRaw('sender_id, count(*) as count')
        ->get()
        ->pluck('count', 'sender_id');

    return response()->json($unreadMessages);
}





}

