const prisma = require("../prisma/db");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: "Plaese Enter All Fileds",
        });
      }
      //   ---- find is email already exist
      const isExist = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (isExist) {
        return res.status(400).json({
          success: false,
          message: "Email Already Exist Plaese Login",
        });
      }

      await prisma.user.create({
        data: {
          email: email,
          password: password,
          name: name,
        },
      });
      res.status(200).json({
        success: true,
        message: "SignUp Successfuly",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  //   --------login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Plaese Email Or Password",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Plaese Enter Valid Information",
        });
      }
      if (user.password !== password) {
        return res.status(400).json({
          success: false,
          message: "Plaese Enter Valid Password",
        });
      }

      const token = await jwt.sign({ id: user }, "UMAR", {
        expiresIn: "1d",
      });

      res.status(200).json({
        success: true,
        message: "Login SuccessFully",
        token,
        user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  //   ----- get profile
  profile: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
      });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User Not Found",
        });
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  // ====== create post
  createPost: async (req, res) => {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Plaese Enter Title",
        });
      }
      if (!description) {
        return res.status(400).json({
          success: false,
          message: "Plaese Enter description",
        });
      }
      const date = new Date();
      const post = await prisma.post.create({
        data: {
          title,
          description,
          userId: req.user.id,
          createdAt: date,
        },
      });
      res.status(200).json({
        success: true,
        message: "Post Created Successfuly",
        post,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  //   =============== get all user post
  getpost: async (req, res) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: req.user.id,
        },
      });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Please Login Your Token Is Expire",
        });
      }
      //   - find the posts
      const posts = await prisma.post.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          user: true,
          comments: true,
        },
      });
      res.status(200).json({ success: true, posts });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  //   ======== comment on post
  addcomment: async (req, res) => {
    try {
      const { Comment } = req.body;
      if (!Comment) {
        return res.status(400).json({
          success: false,
          message: "Plaese Enter Your Comment",
        });
      }
      const post = await prisma.post.findFirst({
        where: {
          id: req.params.id,
        },
      });
      if (!post) {
        return res.status(400).json({
          success: false,
          message: "Plaese Enter Valid PostId",
        });
      }
      const comment = await prisma.comment.create({
        data: {
          title: Comment,
          postId: req.params.id,
          user: req.user,
        },
      });
      res.status(400).json({
        success: true,
        message: "Comment Add Successfuly",
        comment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  //   ======== delet post
  deletePost: async (req, res) => {
    try {
      const ispost = await prisma.post.findFirst({
        where: {
          id: req.params.id,
        },
      });
      if (!ispost) {
        return res.status(400).json({
          success: false,
          message: "Post Not Found",
        });
      }
      // ------- delete comment
      await prisma.comment.deleteMany({
        where: {
          postId: req.params.id,
        },
      });
      await prisma.post.delete({
        where: {
          id: req.params.id,
        },
      });

      res.status(200).json({
        success: false,
        message: "Post Deleted Successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
