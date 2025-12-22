<?php

namespace App\Traits;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * LogsModelActivity
 * 
 * Trait to automatically log model CRUD operations using Spatie Activity Log.
 * Add this trait to any model that should have activity logging.
 */
trait LogsModelActivity
{
    use LogsActivity;

    /**
     * Get the activity log options for the model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly($this->getLogAttributes())
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => $this->getActivityDescription($eventName));
    }

    /**
     * Get attributes to log. Override in model for custom attributes.
     */
    protected function getLogAttributes(): array
    {
        // Default: log all fillable attributes
        return $this->fillable ?? ['*'];
    }

    /**
     * Get the description for the activity.
     */
    protected function getActivityDescription(string $eventName): string
    {
        $modelName = class_basename($this);
        $identifier = $this->getActivityIdentifier();
        
        return match($eventName) {
            'created' => "{$modelName} \"{$identifier}\" was created",
            'updated' => "{$modelName} \"{$identifier}\" was updated",
            'deleted' => "{$modelName} \"{$identifier}\" was deleted",
            default => "{$modelName} \"{$identifier}\" was {$eventName}",
        };
    }

    /**
     * Get an identifier for the model (used in activity description).
     * Override in model for custom identifier.
     */
    protected function getActivityIdentifier(): string
    {
        // Try common identifier fields
        if (isset($this->name)) {
            return $this->name;
        }
        if (isset($this->title)) {
            return $this->title;
        }
        if (isset($this->label)) {
            return $this->label;
        }
        if (isset($this->email)) {
            return $this->email;
        }
        
        return "#{$this->id}";
    }
}
