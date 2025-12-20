<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * CouncilHighlight Model
 * 
 * Represents accomplishments and highlights for each council term.
 * Used in the "IT Through the Years" timeline feature.
 * 
 * @property int $id
 * @property int $academic_year_id
 * @property string $term_label
 * @property string|null $theme
 * @property string $type
 * @property string $title
 * @property string $description
 * @property string|null $image_path
 * @property string|null $icon
 * @property int $display_order
 * @property bool $is_featured
 * @property string|null $accent_color
 */
class CouncilHighlight extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'term_label',
        'theme',
        'type',
        'title',
        'description',
        'image_path',
        'icon',
        'display_order',
        'is_featured',
        'accent_color',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'display_order' => 'integer',
    ];

    /**
     * Type constants
     */
    public const TYPE_ACCOMPLISHMENT = 'accomplishment';
    public const TYPE_EVENT = 'event';
    public const TYPE_INITIATIVE = 'initiative';
    public const TYPE_MILESTONE = 'milestone';

    /**
     * Get available types
     */
    public static function getTypes(): array
    {
        return [
            self::TYPE_ACCOMPLISHMENT => 'Accomplishment',
            self::TYPE_EVENT => 'Event',
            self::TYPE_INITIATIVE => 'Initiative',
            self::TYPE_MILESTONE => 'Milestone',
        ];
    }

    /**
     * Relationships
     */
    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    /**
     * Scopes
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByTerm($query, string $termLabel)
    {
        return $query->where('term_label', $termLabel);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }

    /**
     * Get highlights grouped by term (for timeline display)
     */
    public static function getGroupedByTerm()
    {
        return static::with('academicYear')
            ->ordered()
            ->get()
            ->groupBy('term_label');
    }

    /**
     * Get type icon (Heroicon name)
     */
    public function getTypeIcon(): string
    {
        return match($this->type) {
            self::TYPE_ACCOMPLISHMENT => 'trophy',
            self::TYPE_EVENT => 'calendar',
            self::TYPE_INITIATIVE => 'light-bulb',
            self::TYPE_MILESTONE => 'flag',
            default => 'star',
        };
    }

    /**
     * Get type color
     */
    public function getTypeColor(): string
    {
        return match($this->type) {
            self::TYPE_ACCOMPLISHMENT => 'gold',
            self::TYPE_EVENT => 'cyan',
            self::TYPE_INITIATIVE => 'purple',
            self::TYPE_MILESTONE => 'green',
            default => 'white',
        };
    }
}
