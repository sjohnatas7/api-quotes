const admin = require('./admin')

module.exports = app => {

    app.post('/signup', app.services.users.createUser)
    app.post('/signin', app.services.auth.signin)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .all(app.config.validateToken)
        .get(app.services.users.getUsers)
        .post(admin(app.services.users.createUser))

    app.route('/quotes')
        .all(app.config.passport.authenticate())
        .all(app.config.validateToken)
        .get(app.services.quotes.getAllQuotes)
        .post(app.services.quotes.createQuote)

    app.route('/users/:id/quotes')
        .all(app.config.passport.authenticate())
        .all(app.config.validateToken)
        .get(app.services.quotes.getQuoteByUser)

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .all(app.config.validateToken)
        .get(app.services.users.getUserById)
        .put(app.services.users.updateUser)
        .delete(app.services.users.deleteUser)

    app.route('/quotes/:id')
        .all(app.config.passport.authenticate())
        .all(app.config.validateToken)
        .get(app.services.quotes.getById)
        .delete(app.services.quotes.deleteQuote)
        .put(app.services.quotes.updateQuote)

}