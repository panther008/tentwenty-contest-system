"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import rateLimit from 'koa-ratelimit';
// const rateLimitMiddleware = {
//   name: 'global::rate-limit',
//   config: {
//     driver: 'memory',
//     duration: 60 * 1000, // 1 minute window
//     max: 100, // limit each IP to 100 requests per minute
//     errorMessage: 'Too many requests, please slow down.',
//     id: (ctx) => ctx.ip, // limit by IP
//     headers: {
//       remaining: 'Rate-Limit-Remaining',
//       reset: 'Rate-Limit-Reset',
//       total: 'Rate-Limit-Total',
//     },
//   },
// };
exports.default = [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
    // rateLimitMiddleware,
];
