import * as express from 'express';
import Game from '../models/Game';
import {User, IUser } from './../models/Users';

let router = express.Router();

//To validate users for use of api routes
let userCheck = (req, res, next) => {
    if (!req.user) return res.status(401).send({message: "Unauthorized"});
    //Pull the user from the request obj
    for (let x of req.user['roles']) {
        if (x === 'user') {
          return next();
        }
    }
    res.status(401).send({message: "Unauthorized"});
}

router.get('/:id', userCheck, (req, res, next) => {
    let id = req.params.id;
    Game.find({owner: id}).then((results) => {
        res.json({results: results});
    }).catch((err) => {
        console.log("Error getting the games", err);
    });
});

router.post('/', (req, res, next) => {
    let game = req.body.game;
    Game.create(game).then((results) => {
        res.json({results: results})
    }).catch((err) => {
        console.log("Error creating games", err);
    })
});

//I included this so that if someone deletes
//their account, we can delete these with
//it to keep the db clean.
router.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    Game.remove({owner: id}).then((results) => {
        res.json({results: results});
    }).catch((err) => {
        console.log("Err deleting relevant docs", err);
    })
})
export default router;
