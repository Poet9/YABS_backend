const mongoose = require('mongoose');
const Comment = require('./comment');
const Blog = require('./blog');

const userSchema = mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    picture: {
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

// delete all comments if user got deleted
userSchema.pre('remove', async function (next){
    await Comment.deleteMany({owner: { name: this.nickname, picture: this.picture}});
    await Blog.deleteMany({authorId: this._id});
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;