"use strict";
/**
 * contest controller (final, $not syntax)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::contest.contest', ({ strapi }) => ({
    async find(ctx) {
        var _a;
        const user = ctx.state.user;
        const userRole = ((_a = user === null || user === void 0 ? void 0 : user.role) === null || _a === void 0 ? void 0 : _a.name) || 'Public';
        let accessLevels = [];
        if (userRole === 'VIP') {
            accessLevels = ['VIP', 'Normal'];
        }
        else if (userRole === 'Authenticated') {
            accessLevels = ['Normal'];
        }
        else {
            accessLevels = ['Normal']; // Guests see Normal but can't participate.
        }
        const contests = await strapi.db.query('api::contest.contest').findMany({
            where: {
                accessLevel: accessLevels,
                publishedAt: { $not: null },
            },
            populate: true,
        });
        return contests;
    },
    async findOne(ctx) {
        var _a;
        const user = ctx.state.user;
        const id = ctx.params.id;
        const contest = await strapi.db.query('api::contest.contest').findOne({
            where: {
                id: parseInt(id),
                publishedAt: { $not: null },
            },
            populate: true,
        });
        if (!contest) {
            return ctx.notFound('Contest not found.');
        }
        const userRole = ((_a = user === null || user === void 0 ? void 0 : user.role) === null || _a === void 0 ? void 0 : _a.name) || 'Public';
        if (contest.accessLevel === 'VIP' && userRole !== 'VIP') {
            return ctx.forbidden('This contest is VIP only.');
        }
        return contest;
    },
}));
