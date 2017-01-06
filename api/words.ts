import * as express from 'express';
import Word from '../models/Word';

let router = express.Router();

router.get('/', (req, res, next) => {
    res.json({message: "Boom! Bah-buhm-buhm! Boom!"});
});

router.post('/', (req, res, next) => {
    let words = req.body.words;
    console.log("words is ", words);
    for (var w of words) {
        Word.update({string: w}, {string: w}, {upsert: true})
            .catch((err) => {
                console.log("Error saving word", w, err);
            });
    }
    res.json({message: "I saved " + words.length + " words!"});
});

export default router;