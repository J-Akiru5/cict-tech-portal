import { Link, router } from '@inertiajs/react';
import { ComponentProps, useCallback, useRef } from 'react';

type PrefetchLinkProps = ComponentProps<typeof Link> & {
    prefetch?: boolean;
    prefetchDelay?: number;
};

/**
 * PrefetchLink - A Link component that prefetches pages on hover
 * 
 * This improves perceived performance by loading the next page
 * before the user clicks, reducing Interaction to Next Paint (INP).
 * 
 * @example
 * <PrefetchLink href="/calendar" prefetch>Calendar</PrefetchLink>
 */
export default function PrefetchLink({
    prefetch = true,
    prefetchDelay = 100,
    onMouseEnter,
    onFocus,
    ...props
}: PrefetchLinkProps) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const prefetchedRef = useRef(false);

    const doPrefetch = useCallback(() => {
        if (prefetchedRef.current || !prefetch) return;
        
        // Mark as prefetched to avoid duplicate requests
        prefetchedRef.current = true;
        
        // Use Inertia's router.prefetch if available, otherwise use native prefetch
        if (typeof props.href === 'string') {
            // Create a prefetch link element
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = props.href;
            link.as = 'document';
            document.head.appendChild(link);
        }
    }, [prefetch, props.href]);

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        // Start prefetch timer
        timeoutRef.current = setTimeout(doPrefetch, prefetchDelay);
        
        // Call original handler if provided
        onMouseEnter?.(e);
    }, [doPrefetch, prefetchDelay, onMouseEnter]);

    const handleMouseLeave = useCallback(() => {
        // Cancel prefetch if mouse leaves before delay
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLAnchorElement>) => {
        // Prefetch on focus for keyboard users
        doPrefetch();
        onFocus?.(e);
    }, [doPrefetch, onFocus]);

    return (
        <Link
            {...props}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
        />
    );
}
