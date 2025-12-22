<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * EventReminderNotification
 * 
 * Sent to remind users about an upcoming event they registered for.
 * Uses both database and mail channels.
 */
class EventReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Event $event,
        public int $hoursRemaining = 24
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $timeLabel = $this->hoursRemaining >= 24 
            ? ($this->hoursRemaining / 24) . ' day(s)' 
            : $this->hoursRemaining . ' hour(s)';

        return (new MailMessage)
            ->subject("Reminder: {$this->event->title}")
            ->greeting("Hello {$notifiable->name}!")
            ->line("This is a friendly reminder that your event starts in {$timeLabel}.")
            ->line("**{$this->event->title}**")
            ->line("📅 Date: {$this->event->event_date?->format('F d, Y')}")
            ->line("📍 Location: " . ($this->event->is_online ? 'Online Event' : ($this->event->location ?? 'TBA')))
            ->action('View Event', url("/calendar/event/{$this->event->slug}"))
            ->line('We look forward to seeing you there!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $timeLabel = $this->hoursRemaining >= 24 
            ? ($this->hoursRemaining / 24) . ' day(s)' 
            : $this->hoursRemaining . ' hour(s)';

        return [
            'title' => 'Event Reminder',
            'message' => "{$this->event->title} starts in {$timeLabel}",
            'event_id' => $this->event->id,
            'event_title' => $this->event->title,
            'event_date' => $this->event->event_date?->format('M d, Y'),
            'url' => "/calendar/event/{$this->event->slug}",
            'icon' => 'bell',
        ];
    }
}
