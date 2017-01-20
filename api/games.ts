import * as express from 'express';
import Game from '../models/Game';

let router = express.Router();

router.get('/:id', (req, res, next) => {
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