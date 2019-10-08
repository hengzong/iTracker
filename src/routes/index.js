
/*
 * Connect all of your endpoints together here.
 */

export default function (app, router) {
  app.use('/api', require('./home.js').default(router));
  app.use('/api/bookmarks', require('../api/bookmarks.js'));
  app.use('/api/users', require('../api/users.js'));
};
