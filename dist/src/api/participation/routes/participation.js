"use strict";
/**
 * participation router
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/participation/submit',
            handler: 'participation.submit',
            config: {
                auth: {
                    scope: ['authenticated']
                }
            }
        },
        {
            method: 'GET',
            path: '/participation/leaderboard',
            handler: 'participation.leaderboard',
            config: { auth: false },
        },
        {
            method: 'GET',
            path: '/participation/history',
            handler: 'participation.history',
            config: {
                auth: {
                    scope: ['authenticated']
                }
            }
        },
    ]
};
