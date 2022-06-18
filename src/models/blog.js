const mongoose = require('mongoose');
const Comment = require('./comment');
const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    picture: {
        data: Buffer,
        contentType: String
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        required: true,
        type: String
    },
    hashtags: [{
        hashtag: String
    }],
    rate: {
        type: Number,
        default: 0
    },
    sources: [{
        source: {
            type: String,
            required: true,
            trim: true
        }
    }],
    raters:[{
        rater :{
            type: Number,
            required: true
        },
        note:{
            type: Number,
            required: true
        }
    }],
    authorId: Number
}, {
    timeStamp: true
});

//virtual relationship with author
blogSchema.virtual('users', {
    ref: 'User',
    localField: 'authorId',
    foreignField: '_id',
    justOne: true
});
//virtual relationship with comments
blogSchema.virtual('comments', {
    ref: 'Comment',
    localField: 'id',
    foreignField: 'articleId'
});
// deleting comments if blog got deleted
blogSchema.pre('remove', async function (next){
    await Comment.deleteMany({articleId: this._id});
    next();
});

const blog = mongoose.model('Blog', blogSchema);
module.exports = blog;

