<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * FeedbackController
 * 
 * Handles student feedback submission and viewing.
 */
class FeedbackController extends Controller
{
    /**
     * Display feedback list for the current user
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        $feedbacks = Feedback::byUser($user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($feedback) {
                return [
                    'id' => $feedback->id,
                    'subject' => $feedback->subject,
                    'category' => $feedback->category,
                    'categoryLabel' => $feedback->category_label,
                    'priority' => $feedback->priority,
                    'status' => $feedback->status,
                    'statusLabel' => $feedback->status_label,
                    'isAnonymous' => $feedback->is_anonymous,
                    'hasResponse' => !empty($feedback->response),
                    'createdAt' => $feedback->created_at->format('M d, Y'),
                ];
            });
        
        return Inertia::render('Student/Feedback/Index', [
            'feedbacks' => $feedbacks,
            'categories' => Feedback::CATEGORIES,
        ]);
    }

    /**
     * Show create feedback form
     */
    public function create(): Response
    {
        return Inertia::render('Student/Feedback/Create', [
            'categories' => Feedback::CATEGORIES,
            'priorities' => Feedback::PRIORITIES,
        ]);
    }

    /**
     * Store a new feedback
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => ['required', 'in:suggestion,complaint,inquiry,appreciation,other'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
            'priority' => ['required', 'in:low,medium,high'],
            'is_anonymous' => ['boolean'],
        ]);

        $feedback = Feedback::create([
            'user_id' => Auth::id(),
            'category' => $validated['category'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'priority' => $validated['priority'],
            'is_anonymous' => $validated['is_anonymous'] ?? false,
            'status' => 'pending',
        ]);

        return redirect()->route('student.feedback.index')
            ->with('success', 'Your feedback has been submitted successfully!');
    }

    /**
     * Show a specific feedback
     */
    public function show(Feedback $feedback): Response
    {
        // Ensure user owns this feedback
        if ($feedback->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Student/Feedback/Show', [
            'feedback' => [
                'id' => $feedback->id,
                'subject' => $feedback->subject,
                'message' => $feedback->message,
                'category' => $feedback->category,
                'categoryLabel' => $feedback->category_label,
                'priority' => $feedback->priority,
                'status' => $feedback->status,
                'statusLabel' => $feedback->status_label,
                'isAnonymous' => $feedback->is_anonymous,
                'response' => $feedback->response,
                'respondedAt' => $feedback->responded_at?->format('M d, Y g:i A'),
                'responderName' => $feedback->responder?->name,
                'createdAt' => $feedback->created_at->format('M d, Y g:i A'),
            ],
        ]);
    }
}
