<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Messagem extends Model
{
    use HasFactory;

    protected $table = 'messages';

    // If you have additional columns like sender_id, recipient_id, etc., add them here
    protected $fillable = [
        'content',
        'sender_id',
        'recipient_id',
    ];

    public function isSeen()
{
    return !is_null($this->seen_at);
}

}
