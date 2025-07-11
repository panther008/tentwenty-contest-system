/**
 * participation controller
 */

import { factories } from '@strapi/strapi'
import { Context } from 'koa';
export default factories.createCoreController('api::participation.participation', ({ strapi }) => ({
  async submit(ctx: Context) {
    const user = ctx.state.user;
    const { contestId, answers } = ctx.request.body as {
      contestId: number;
      answers: Record<number, string[]>;
    };

    if (!contestId || !answers) {
      return ctx.badRequest('contestId and answers required.');
    }

    const contest = await strapi.db.query('api::contest.contest').findOne({
      where: { id: contestId },
      populate: { questions: true },
    });

    if (!contest) return ctx.badRequest('Contest not found.');

    const now = new Date();
    if (now < new Date(contest.startDate) || now > new Date(contest.endDate)) {
      return ctx.badRequest('Contest not active.');
    }

    const userRole = user?.role?.name;
    if (contest.accessLevel === 'VIP' && userRole !== 'VIP') {
      return ctx.forbidden('This contest is VIP only.');
    }

    let score = 0;
    for (const q of contest.questions) {
      const ua = answers[q.id];
      if (!ua) continue;
      if (JSON.stringify([...ua].sort()) === JSON.stringify([...q.correctAnswers].sort())) {
        score += 1;
      }
    }

    await strapi.db.query('api::participation.participation').create({
      data: {
        user: user.id,
        contest: contest.id,
        answers,
        score,
        submitted: true,
        submittedAt: now,
      },
    });

    return { score };
  },
  async leaderboard(ctx: Context) {
  const { contestId } = ctx.request.query as { contestId: string };
  if (!contestId) return ctx.badRequest('contestId required.');

  const participations = await strapi.db.query('api::participation.participation').findMany({
    where: { contest: parseInt(contestId), submitted: true },
    populate: ['user'],
    orderBy: [{ score: 'desc' }],
    limit: 20,
  });

  return participations.map((p, i) => ({
    user: p.user.username,
    score: p.score,
    rank: i + 1,
  }));
},
async history(ctx: Context) {
  const user = ctx.state.user;
  if (!user) {
      return ctx.unauthorized('You must be logged in.');
    }
  const participations = await strapi.db.query('api::participation.participation').findMany({
    where: { user: user.id },
    populate: ['contest'],
  });

  const prizes = await strapi.db.query('api::prize-history.prize-history').findMany({
    where: { user: user.id },
    populate: ['contest'],
  });
 const inProgress = participations.filter(p => !p.submitted);
    const completed = participations.filter(p => p.submitted);
 ctx.body = {
      inProgress,
      completed,
      prizesWon: prizes,
    };
}
}));
