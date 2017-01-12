import * as mongoose from 'mongoose';

export interface IWord extends mongoose.Document {
    string: string
}
let wordSchema = new mongoose.Schema({
    string: {type: String, required: true}
});
export default mongoose.model<IWord>('Word', wordSchema);