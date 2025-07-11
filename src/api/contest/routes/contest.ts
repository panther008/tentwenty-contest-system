/**
 * contest router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/contests',
      handler: 'contest.find',
      config: { auth: false }, // Public can see
    },
    {
    method: 'GET',
    path: '/contests/:id',
    handler: 'contest.findOne',
    config: { auth: false },
    }
  ],
};
