<!DOCTYPE html>
<html>
<head>
    <title>Event Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 2px solid #D4A017; padding-bottom: 20px; margin-bottom: 20px;">
            <h2 style="color: #800000; margin: 0;">Event Reminder</h2>
            <p style="color: #666; margin: 5px 0 0;">Don't forget! Your event is coming up soon.</p>
        </div>

        <!-- Body -->
        <div style="padding: 0 10px;">
            <p>Hello <strong>{{ $user->name }}</strong>,</p>
            <p>This is a friendly reminder that you are registered for:</p>
            
            <div style="background: #fdfbf7; border: 1px solid #D4A017; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #800000; margin-top: 0;">{{ $event->title }}</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 5px 0; color: #666; width: 80px;">Date:</td>
                        <td style="padding: 5px 0; font-weight: bold;">{{ $event->event_date->format('F d, Y') }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #666;">Time:</td>
                        <td style="padding: 5px 0; font-weight: bold;">
                            {{ $event->start_time ? date('g:i A', strtotime($event->start_time)) : 'All Day' }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #666;">Location:</td>
                        <td style="padding: 5px 0; font-weight: bold;">
                            @if($event->is_online)
                                Online Event
                            @else
                                {{ $event->location ?? 'To be announced' }}
                            @endif
                        </td>
                    </tr>
                </table>
                
                @if($event->is_online && $event->meeting_link)
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ddd;">
                        <a href="{{ $event->meeting_link }}" style="display: inline-block; background-color: #D4A017; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Join Meeting</a>
                    </div>
                @endif
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <a href="{{ route('student.events.show', $event->id) }}" style="display: inline-block; padding: 10px 20px; background-color: #800000; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">View Event Details</a>
            </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999;">
            <p>&copy; {{ date('Y') }} CICT Tech Portal. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
