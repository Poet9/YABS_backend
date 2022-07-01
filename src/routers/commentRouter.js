const express = require("express");
const Comment = require("../models/comment");
const User = require("../models/user");
const { auth } = require("../auth/auth");

// creating a router for comments
const router = new express.Router({ strict: true });
/**
 * @swagger
 * components:
 *    schemas:
 *       Comment:
 *          type: object
 *          required:
 *             - body
 *             - owner
 *          properties:
 *             id:
 *                 type: number
 *                 description: mongo object id
 *             body:
 *               type: string
 *               description: bozabli
 *             owner:
 *                type: number
 *                description:ljyfviytfiè-fiutfifityf(-ydtrfytf_è-fè(d))
 *          example:
 *             id: 65186165168165165
 *             body: qsdoifhqsofiqzpsoif hazpofhqsmdofhqepsudfl ub
 *             owner : 63546549865034
 */
/**** writing a comment */
router.post("/:blogId", auth, async (req, res) => {
  // create a new comment document
  const comment = new Comment({
    body: req.body.commentBody,
    owner: {
      name: req.user.nickname,
      picture: req.user.picture,
    },
    articleId: req.params.blogId,
  });
  try {
    //saving the comment
    await comment.save();
    res.status(201).send(comment);
  } catch (e) {
    res.status(400).send({ error: e });
  }
});
// get comments
router.get("/:blogId", async (req, res) => {
  try {
    const comments = await Comment.find(
      {
        articleId: req.params.blogId,
      },
      {},
      {
        //options
        limit: 3,
        skip: parseInt(req.query.skip),
      }
    );
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

/******* this request needs you be *logged in* and *commentId param*  and has two types:
 * 1-   updating ['body'] you need to be *the writer* and *body*
 * 2-   updating rate need *rate body*
 *  *****/
router.patch("/:id", auth, async (req, res) => {
  // checking if updates are valid
  const updates = Object.keys(req.body);
  const updatable = ["commentbody", "commentlikes"];
  const isUpdateValid = updates.every((update) => updatable.includes(update));
  if (!isUpdateValid)
    return res.status(400).send({ error: "Property not found." });
  try {
    // find comment and making sure the owner is respensible for update in case of edit
    const comment = await Comment.findOne({ _id: req.params.id });
    if (!comment) return res.status(404).send({ error: "comment not found" });
    // updating comment body
    if (updates.includes("commentbody")) {
      const commentAuthor = comment.owner.name === req.user.nickname;
      if (!commentAuthor) throw new Error();
      comment.body = req.body.commentbody;
    }
    // check if user has already liked this comment or not
    const likedAlready = comment.likers.findIndex((id) => id === req.user._id);
    if (likedAlready === -1) {
      // case like comment
      comment = {
        ...comment,
        likes: comment.likes + 1,
        likers: [...comment.likers, req.user._id],
      };
    } else {
      // unlike comment
      comment = {
        ...comment,
        likes: comment.likes - 1,
        likers: comment.likers.splice(likedAlready, 1),
      };
    }
    // find comment in case of like
    await comment.save();
    res.send(comment);
  } catch (e) {
    res.status(400).send({ error: "bad request" });
  }
});
// delete comment
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = Comment.deleteOne({
      _id: req.params.id,
      owner: { name: req.user.nickname },
    });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});
module.exports = router;
