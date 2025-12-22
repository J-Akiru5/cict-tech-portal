<?php

namespace App\Policies;

use App\Models\User;
use App\Models\AchievementPost;
use App\Models\PostComment;

/**
 * AchievementPostPolicy
 * 
 * Authorization rules for achievement posts and comments.
 */
class AchievementPostPolicy
{
    /**
     * Roles that can create/manage achievement posts
     */
    protected array $postingRoles = [
        'sc-president',
        'sc-evp',
        'sc-secretary',
        'sc-comms-director',
        'sc-adviser',
        'dean',
        'main-admin',
    ];

    /**
     * Roles that can moderate (delete/flag) comments
     */
    protected array $moderatorRoles = [
        'sc-president',
        'sc-adviser',
        'dean',
        'main-admin',
    ];

    /**
     * Determine if the user can view any posts.
     * Everyone can view posts (including guests via public routes).
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view a specific post.
     */
    public function view(?User $user, AchievementPost $post): bool
    {
        return true;
    }

    /**
     * Determine if the user can create posts.
     * Only authorized officers can post.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole($this->postingRoles);
    }

    /**
     * Determine if the user can update the post.
     * Author or moderators can update.
     */
    public function update(User $user, AchievementPost $post): bool
    {
        // Author can edit their own post
        if ($user->id === $post->user_id) {
            return true;
        }
        
        // Moderators can edit any post
        return $user->hasAnyRole($this->moderatorRoles);
    }

    /**
     * Determine if the user can delete the post.
     * Author or moderators can delete.
     */
    public function delete(User $user, AchievementPost $post): bool
    {
        // Author can delete their own post
        if ($user->id === $post->user_id) {
            return true;
        }
        
        // Moderators can delete any post
        return $user->hasAnyRole($this->moderatorRoles);
    }

    /**
     * Determine if the user can react to posts.
     * Any authenticated user can react.
     */
    public function react(User $user): bool
    {
        return true; // Any logged-in user
    }

    /**
     * Determine if the user can comment on posts.
     * Any authenticated user can comment.
     */
    public function comment(User $user): bool
    {
        return true; // Any logged-in user
    }

    /**
     * Determine if the user can delete a comment.
     * Author of comment or moderators can delete.
     */
    public function deleteComment(User $user, PostComment $comment): bool
    {
        // Author can delete their own comment
        if ($user->id === $comment->user_id) {
            return true;
        }
        
        // Moderators can delete any comment
        return $user->hasAnyRole($this->moderatorRoles);
    }

    /**
     * Determine if the user can flag a comment.
     * Moderators can flag inappropriate comments.
     */
    public function flagComment(User $user, PostComment $comment): bool
    {
        return $user->hasAnyRole($this->moderatorRoles);
    }

    /**
     * Determine if the user can pin/unpin posts.
     * Only moderators can pin.
     */
    public function pin(User $user, AchievementPost $post): bool
    {
        return $user->hasAnyRole($this->moderatorRoles);
    }
}
