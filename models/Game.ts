import * as mongoose from 'mongoose';

export interface IGame extends mongoose.Document {
    date: Date,
    mistakes: Number,
    wordsTyped: Number,
    keysTyped: Number,
    gameLength: Number,
    accuracy: Number,
    topLevel: Number,
    levels: Number[],
    owner: String
}
let gameSchema = new mongoose.Schema({
    date: Date,
    mistakes: Number,
    wordsTyped: Number,
    keysTyped: Number,
    gameLength: Number,
    accuracy: Number,
    topLevel: Number,
    levels: [Number],
    owner: String
});

export default mongoose.model<IGame>("Game", gameSchema);