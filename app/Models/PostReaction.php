<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * PostReaction Model
 * 
 * Multi-emoji reactions for achievement posts.
 */
class PostReaction extends Model
{
    use HasFactory;

    public $timestamps = false;
    
    protected $fillable = [
        'post_id',
        'user_id',
        'reaction_type',
    ];

    /**
     * Reaction types with their display info
     */
    public const REACTION_LIKE = 'like';
    public const REACTION_LOVE = 'love';
    public const REACTION_CELEBRATE = 'celebrate';
    public const REACTION_APPLAUD = 'applaud';

    public const REACTIONS = [
        self::REACTION_LIKE => ['emoji' => '👍', 'label' => 'Like'],
        self::REACTION_LOVE => ['emoji' => '❤️', 'label' => 'Love'],
        self::REACTION_CELEBRATE => ['emoji' => '🎉', 'label' => 'Celebrate'],
        self::REACTION_APPLAUD => ['emoji' => '👏', 'label' => 'Applaud'],
    ];

    /**
     * Relationships
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(AchievementPost::class, 'post_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Accessors
     */
    public function getEmojiAttribute(): string
    {
        return self::REACTIONS[$this->reaction_type]['emoji'] ?? '👍';
    }

    public function getLabelAttribute(): string
    {
        return self::REACTIONS[$this->reaction_type]['label'] ?? 'Like';
    }

    /**
     * Get all available reaction types
     */
    public static function getTypes(): array
    {
        return array_keys(self::REACTIONS);
    }
}
