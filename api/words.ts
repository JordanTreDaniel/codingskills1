import * as express from 'express';
import Word from '../models/Word';

let router = express.Router();

router.get('/', (req, res, next) => {
    let pattern = new RegExp(req.body.pattern);
    Word.find({string: {$regex: pattern, $options: 'i'}}).then((results) => {
        res.json({message: results});
    }).catch((err) => {
        console.log("Err getting the words", err);
    })
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