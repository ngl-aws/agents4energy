/// <reference types="node" />

export class RateLimiter {
    private static instance: RateLimiter;
    private lastInvocationTime: number | null = null;
    private rateLimitSeconds: number;

    private constructor(rateLimitSeconds: number = 0) {
        this.rateLimitSeconds = rateLimitSeconds;
    }

    public static getInstance(rateLimitSeconds?: number): RateLimiter {
        if (!RateLimiter.instance) {
            RateLimiter.instance = new RateLimiter(rateLimitSeconds);
        }
        return RateLimiter.instance;
    }

    public async waitForRateLimit(): Promise<void> {
        if (this.rateLimitSeconds <= 0) {
            return; // No rate limiting if not configured
        }

        const now = Date.now();
        if (this.lastInvocationTime !== null) {
            const timeSinceLastInvocation = now - this.lastInvocationTime;
            const waitTime = Math.max(0, (this.rateLimitSeconds * 1000) - timeSinceLastInvocation);
            
            if (waitTime > 0) {
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
        
        this.lastInvocationTime = Date.now();
    }
} 