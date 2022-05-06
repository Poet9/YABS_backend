const mongoose= require("mongoose");

const commentSchema = new mongoose.Schema({
    authorName: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    replies: [{
        reply: {
            type: Schema.ObjectId,
            ref: commentSchema
        }
    }],
    likes: {
        type: Number,
        default: 0
    },
    articleId: Number 
}, {
    timeStamp: true
});

//virtual relationship with blog  
commentSchema.virtual('blogs', {
    ref: 'Blog',
    localField: 'articleId',
    foreignField: '_id',
    justOne: true
});

//virtual relationship with user  
commentSchema.virtual('users', {
    ref: 'User',
    localField: 'authorId',
    foreignField: '_id',
    justOne: true
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;