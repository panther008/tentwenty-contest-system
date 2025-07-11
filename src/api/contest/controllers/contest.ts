/**
 * contest controller (final, $not syntax)
 */

import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController('api::contest.contest', ({ strapi }) => ({
  async find(ctx: Context) {
    const user = ctx.state.user;

    const userRole = user?.role?.name || 'Public';

    let accessLevels: string[] = [];

    if (userRole === 'VIP') {
      accessLevels = ['VIP', 'Normal'];
    } else if (userRole === 'Authenticated') {
      accessLevels = ['Normal'];
    } else {
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

  async findOne(ctx: Context) {
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

    const userRole = user?.role?.name || 'Public';

    if (contest.accessLevel === 'VIP' && userRole !== 'VIP') {
      return ctx.forbidden('This contest is VIP only.');
    }

    return contest;
  },
}));
