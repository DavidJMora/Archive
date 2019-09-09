const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new mongoose.Schema({
    todo: {type: String, default: ''},
    user_id: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    completed: { type: Boolean, default: false}
})

module.exports = mongoose.model('todo', TodoSchema);
