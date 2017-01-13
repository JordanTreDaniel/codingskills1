import * as express from 'express';
import * as passport from 'passport';
import methods from '../api/methods';
let router = express.Router();
const fbRedirect = { session: true, failureRedirect: '/registration', successRedirect: '/' };

/* GET home page. */
router.get('/',
  function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

router.get('/login/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', { failureRedirect: '/login' }, (e, user) => {
      if (e) res.redirect('/loginregister');
      req.login(user, (err) => {
        if(err) res.redirect('/loginregister');
        req.session.save((error) => {
          if(error) res.redirect('/loginregister');
          res.redirect('/loginregister');
        })
      })
    })
  });
  
export = router;
