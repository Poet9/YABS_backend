const mongoose= require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    owner: {
      name: String,
      picture: String,
    },
    body: {
      type: String,
      required: true,
    },
    replies: [
      {
        reply: {
          owner: {
            name: String,
            picture: String,
          },
          body: {
            type: String,
            required: true,
          },
        },
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    likers: [
      {
        type: Number,
        required: true,
      },
    ],
    articleId: Number,
  },
  {
    timeStamp: true,
  }
);

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
    localField: 'owner.name',
    foreignField: 'nickname',
    justOne: true
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;