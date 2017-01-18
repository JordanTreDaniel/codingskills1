import * as mongoose from 'mongoose';

export interface IGame extends mongoose.Document {
    date: Date,
    mistakes: Number,
    wordsTyped: Number,
    keysTyped: Number,
    errorRate: Number,
    gameLength: Number,
    accuracy: Number,
    level: Number,
    owner: String
}
let gameSchema = new mongoose.Schema({
    date: Date,
    mistakes: Number,
    wordsTyped: Number,
    keysTyped: Number,
    errorRate: Number,
    gameLength: Number,
    accuracy: Number,
    level: Number,
    owner: String
});

export default mongoose.model<IGame>("Game", gameSchema);