declare module 'locomotive-scroll' {
    interface LocomotiveScrollOptions {
        el?: HTMLElement;
        smooth?: boolean;
        multiplier?: number;
        lerp?: number;
        class?: string;
        scrollFromAnywhere?: boolean;
        smartphone?: {
            smooth?: boolean;
        };
        tablet?: {
            smooth?: boolean;
        };
    }

    interface LocomotiveScrollInstance {
        destroy(): void;
        update(): void;
        start(): void;
        stop(): void;
        scrollTo(target: string | number | HTMLElement, options?: object): void;
    }

    export default class LocomotiveScroll implements LocomotiveScrollInstance {
        constructor(options?: LocomotiveScrollOptions);
        destroy(): void;
        update(): void;
        start(): void;
        stop(): void;
        scrollTo(target: string | number | HTMLElement, options?: object): void;
    }
}
