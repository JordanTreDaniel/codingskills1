import * as express from 'express';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as session from 'express-session';
import {User, IUser} from './../models/Users';
import * as _ from 'lodash';
let router = express.Router();

//Express has Express.Request but the interface isn't very good...  requires overrides


// namespace codingskills {
//   export class Session {
//     constructor()
//   };
// }

//
//
// function setSession(req, res, next) {
//   let token = user.generateJWT();
//   return req.logIn(user, (err) => {
//     if (err) res.status(500).json({message: 'login failed'});
//     return req.session.save(function (err){
//       if (err) res.sendStatus(500).json({message: 'session failed'});
//
//       if(!_.isUndefined(req, 'user.facebookId')){
//         res.redirect('/myaccount');
//       }
//
//       return res.json({message: 'Session successful.'})
//     });
//   });
// }
//
// function destroySession(req, res, next) {
//
//   req.session.destroy((err) => {
//     if (err) return res.status(500).json({message: 'still authenticated, please try again.'});
//     req.user = null;
//     req.logout();
//     return res.json({isAuthenticated: req.isAuthenticated()});
//   });
// }
//
// const methods = {
//   setSession: setSession,
//   destroySession: destroySession
// }
//
// export default methods;
