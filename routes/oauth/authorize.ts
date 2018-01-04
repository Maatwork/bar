const router = require('express').Router();
const app = require('../../app');
const client = require('../../db/models').Client;

/* GET Authorize page. */
router.get('/', function (req, res) {
    if (req.user) {
        if (!req.query.clientId) return res.send('Please send a clientID!');
        client.findOne({where: {id: req.query.clientId}}, {raw: true})
            .then(client => {
                if (!client) return res.send('ERROR invalid client ID!');
                res.render('oauth/authorize', {
                    title: 'Authorize',
                    scope: req.query.scope,
                    client: client,
                    state: req.query.state,
                    redirectUri: client.redirect_url
                });

            });
    } else {
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }
});

router.post('/', app.oauth.authorize());

module.exports = router;