const mongoose = require('mongoose');

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
    raters: {
        type: Number,
        default: 0
    },
    authorId: Number
}, {
    timeStamp: true
});

//virtual relationship with author
commentSchema.virtual('author', {
    ref: 'User',
    localField: 'authorId',
    foreignField: '_id',
    justOne: true
});

const blog = mongoose.model('Blog', blogSchema);
module.exports = blog;

