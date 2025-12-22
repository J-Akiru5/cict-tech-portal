<?php

namespace App\Http\Controllers;

use App\Models\AchievementPost;
use App\Models\PostReaction;
use App\Models\PostComment;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AchievementPostController extends Controller
{
    /**
     * Display the achievement feed (public).
     */
    public function index(Request $request)
    {
        $query = AchievementPost::with(['author', 'academicYear'])
            ->withCount(['reactions', 'comments'])
            ->latest();

        // Filter by category
        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        // Filter by academic year
        if ($request->filled('year')) {
            $query->forYear($request->year);
        }

        $posts = $query->paginate(10);

        // Add user reaction to each post if authenticated
        if (Auth::check()) {
            $posts->getCollection()->transform(function ($post) {
                $post->user_reaction = $post->userReaction(Auth::user())?->reaction_type;
                $post->reaction_counts = $post->getReactionCounts();
                return $post;
            });
        }

        $academicYears = AcademicYear::orderBy('year_start', 'desc')->get();
        $canPost = Auth::check() ? Auth::user()->can('create', AchievementPost::class) : false;

        return Inertia::render('Public/AchievementFeed', [
            'posts' => $posts,
            'categories' => AchievementPost::CATEGORIES,
            'academicYears' => $academicYears,
            'canPost' => $canPost,
            'filters' => $request->only(['category', 'year']),
        ]);
    }

    /**
     * Store a new achievement post.
     */
    public function store(Request $request)
    {
        $this->authorize('create', AchievementPost::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:5000',
            'category' => 'required|in:event,award,project',
            'image' => 'nullable|image|max:5120', // 5MB max
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('achievements', 'public');
        }

        $currentYear = AcademicYear::getCurrentYear();

        $post = AchievementPost::create([
            'user_id' => Auth::id(),
            'academic_year_id' => $currentYear?->id ?? 1,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'],
            'image_path' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'Achievement posted successfully!');
    }

    /**
     * Update an achievement post.
     */
    public function update(Request $request, AchievementPost $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:5000',
            'category' => 'required|in:event,award,project',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($post->image_path) {
                Storage::disk('public')->delete($post->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('achievements', 'public');
        }

        $post->update($validated);

        return redirect()->back()->with('success', 'Post updated successfully!');
    }

    /**
     * Delete an achievement post.
     */
    public function destroy(AchievementPost $post)
    {
        $this->authorize('delete', $post);

        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        $post->delete();

        return redirect()->back()->with('success', 'Post deleted successfully!');
    }

    /**
     * Toggle reaction on a post.
     */
    public function react(Request $request, AchievementPost $post)
    {
        $this->authorize('react', AchievementPost::class);

        $validated = $request->validate([
            'reaction_type' => 'required|in:like,love,celebrate,applaud',
        ]);

        $existingReaction = $post->reactions()
            ->where('user_id', Auth::id())
            ->first();

        if ($existingReaction) {
            if ($existingReaction->reaction_type === $validated['reaction_type']) {
                // Same reaction = remove it
                $existingReaction->delete();
                $post->updateCounts();
                return response()->json(['removed' => true]);
            } else {
                // Different reaction = update it
                $existingReaction->update(['reaction_type' => $validated['reaction_type']]);
                return response()->json(['updated' => true, 'type' => $validated['reaction_type']]);
            }
        }

        // New reaction
        PostReaction::create([
            'post_id' => $post->id,
            'user_id' => Auth::id(),
            'reaction_type' => $validated['reaction_type'],
        ]);

        $post->updateCounts();

        return response()->json(['added' => true, 'type' => $validated['reaction_type']]);
    }

    /**
     * Add a comment to a post.
     */
    public function comment(Request $request, AchievementPost $post)
    {
        $this->authorize('comment', AchievementPost::class);

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:post_comments,id',
        ]);

        $comment = PostComment::create([
            'post_id' => $post->id,
            'user_id' => Auth::id(),
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
        ]);

        $post->updateCounts();

        return response()->json([
            'success' => true,
            'comment' => $comment->load('author'),
        ]);
    }

    /**
     * Get comments for a post (for AJAX loading).
     */
    public function comments(AchievementPost $post)
    {
        $comments = $post->topLevelComments()
            ->with(['author', 'nestedReplies'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['comments' => $comments]);
    }

    /**
     * Delete a comment.
     */
    public function deleteComment(PostComment $comment)
    {
        $this->authorize('deleteComment', [AchievementPost::class, $comment]);

        $post = $comment->post;
        $comment->delete();
        $post->updateCounts();

        return response()->json(['success' => true]);
    }

    /**
     * Flag a comment.
     */
    public function flagComment(Request $request, PostComment $comment)
    {
        $this->authorize('flagComment', [AchievementPost::class, $comment]);

        $validated = $request->validate([
            'reason' => 'nullable|string|max:255',
        ]);

        $comment->flag(Auth::user(), $validated['reason'] ?? null);

        return response()->json(['success' => true]);
    }

    /**
     * Toggle pin status.
     */
    public function togglePin(AchievementPost $post)
    {
        $this->authorize('pin', $post);

        $post->update(['is_pinned' => !$post->is_pinned]);

        return redirect()->back()->with('success', $post->is_pinned ? 'Post pinned!' : 'Post unpinned!');
    }
}
