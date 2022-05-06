const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: String,
});

/****** virtuals ****/
userSchema.virtual('blogs', {
   ref: 'Blog',
   localField: '_id',
   foreignField: 'authorId'
});
userSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'owner'
})



const User = mongoose.model('User', userSchema);

module.exports = User;