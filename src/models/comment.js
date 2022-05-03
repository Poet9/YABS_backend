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
    blogId: Number 
}, {
    timeStamp: true
});

//virtual relationship with blog  
commentSchema.virtual('blog', {
    ref: 'Blog',
    localField: 'blogId',
    foreignField: '_id',
    justOne: true
});

//virtual relationship with user  
commentSchema.virtual('author', {
    ref: 'User',
    localField: 'authorId',
    foreignField: '_id',
    justOne: true
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;