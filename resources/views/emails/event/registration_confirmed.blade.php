<!DOCTYPE html>
<html>
<head>
    <title>Registration Confirmed</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 2px solid #D4A017; padding-bottom: 20px; margin-bottom: 20px;">
            <h2 style="color: #800000; margin: 0;">CICT Tech Portal</h2>
            <p style="color: #666; margin: 5px 0 0;">Event Registration Confirmed</p>
        </div>

        <!-- Body -->
        <div style="padding: 0 10px;">
            <p>Hello <strong>{{ $user->name }}</strong>,</p>
            <p>You have successfully registered for the following event:</p>
            
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
                            @if($event->end_time)
                                - {{ date('g:i A', strtotime($event->end_time)) }}
                            @endif
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

            <p>Please present your student ID or this email at the registration desk (for in-person events).</p>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="{{ route('student.events.myRegistrations') }}" style="color: #800000; text-decoration: underline;">View My Registrations</a>
            </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999;">
            <p>If you can no longer attend, please cancel your registration via the portal to free up your slot.</p>
            <p>&copy; {{ date('Y') }} CICT Tech Portal. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
