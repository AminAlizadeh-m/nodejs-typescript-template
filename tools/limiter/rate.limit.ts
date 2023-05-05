import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

export const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: parseInt(process.env.WINDOW_SIZE_IN_MS as string) || 1 * 60 * 1000,
  max: parseInt(process.env.MAX_WINDOW_REQUEST_COUNT as string) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many request, please try again after a minute' },
});
