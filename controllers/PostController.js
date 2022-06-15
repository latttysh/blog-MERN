import Post from '../models/Post.js';
import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec(); // search post with relationship "user"

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось получить теги',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать пост',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec(); // search post with relationship "user"
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; //get ID paramets

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 }, // increment viewws
      },
      {
        returnDocument: 'after', //return document after update
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: 'Не удалось получить статью',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }
        res.json(doc);
      },
    );
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id; //get ID paramets

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          message: 'Статья удалена',
        });
      },
    );
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id; //get ID paramets

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      },
    );

    res.json({
      message: 'Статья успешно изменена',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};
