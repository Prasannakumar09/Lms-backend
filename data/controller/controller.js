const express = require("express");
// const adminModel = require("../model/adminmodel");
const userModel = require("../model/usermodel");
const courseModel = require("../model/course");
const announceModel = require("../model/announcement");
const cartModel = require("../model/cart");
const feedbackModel = require("../model/feedback");
const discussionModel = require("../model/discussion");
const questionModel = require("../model/questions");
const resultStatModel = require("../model/quizStats");
const pollModel = require('../model/chat');
const messageModel = require('../model/message');
const files = require("../model/assests");
const sendMail = require("../middleware/mailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const verifytoken = require("../middleware/verifyToken");

const adminuser = async (req, res) => {
  const { username, role, password, email } = req.body;
  if (!username || !password || !role || !email) {
    return res.status(400).json({ error: "all the fields are required" });
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  try {
    const admin = await userModel.create({
      username: username,
      role: role,
      password: hashedpassword,
      email,
    });
    res.status(200).json({ message: "user successfully logged in" });
  } catch (err) {
    res.status(400).json({ error: "login failed" });
  }
};
const lastcourse = async (req, res) => {
  try {
    const course = await courseModel.aggregate([
      { $match: { status: "approved" } },
      { $sort: { createdAt: -1 } },
      { $limit: 1 },
    ]);
    res.status(200).json(course);
  } catch (err) {
    res.status(400).json({ error: "Fetching lastcourse Failed" });
  }
};
const userlogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const findadmin = await userModel.findOne({ username });
    if (!findadmin) {
      return res.status(400).json({ error: "User not found" });
    }

    const comparepassword = await bcrypt.compare(password, findadmin.password);
    if (!comparepassword) {
      return res.status(400).json({ error: "Password not matched" });
    }

    const token = jwt.sign({ userid: findadmin._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      status: true,
      message: "User logged in successfully",
      user: findadmin.role,
      name: findadmin.username,
      email: findadmin.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "user not exists" });
  }
};
const adminadduser = async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !password || !email || !role) {
    return res.status(400).json({ error: "all the fields are required" });
  }
  if (role === "mentor" || role === "student") {
    const findmentor = await userModel.findOne({ email });
    const id = req.userId;
    if (findmentor) {
      return res.status(400).json({ error: "email id already exists" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    try {
      const mentor = await userModel.create({
        username: username,
        email: email,
        role: role,
        password: hashedpassword,
      });
      res.status(200).json({ message: `${role} successfully created` }, id);
    } catch (err) {
      res.status(400).json({ error: `${role} creation failed` });
    }
  } else {
    return res.status(400).json({ error: "role does not exists" });
  }
};
const getUsers = async (req, res) => {
  try {
    const mentorUsers = await userModel.find({}, "username email role _id");
    res.status(200).json(mentorUsers);
  } catch (err) {
    res.status(400).json({ error: "can't fetch mentor data" });
  }
};
const deleteUsers = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "deleting User failed" });
  }
};
const editForm = async (req, res) => {
  try {
    const { _id, username, email, role } = req.body;
    await userModel.findByIdAndUpdate(
      _id,
      { username, email, role },
      { new: true }
    );
    res.status(200).json({ message: "mentor successfully Updated" });
  } catch (err) {
    res.status(400).json({ error: "Updating User failed" });
  }
};
const getUserscount = async (req, res) => {
  try {
    const totalcount = await userModel.countDocuments();
    const mentorcount = await userModel.countDocuments({ role: "mentor" });
    const studentcount = await userModel.countDocuments({ role: "student" });
    const approvedCourses = await courseModel.countDocuments({
      status: "approved",
    });
    res.status(200).json({
      totalcount,
      mentorcount,
      studentcount,
      approvedCourses,
    });
  } catch (err) {
    res.status(400).json({ error: "Counting failed" });
  }
};
const addCourse = async (req, res) => {
  try {
    const { title, mentorname, category, pricing, description } = req.body;
    const existing = await courseModel.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });
    if (existing) {
      return res.status(409).json({ error: "Course Already Exists" });
    }
    const newCourse = await courseModel.create(req.body);
    const toEmail = "prasannaramsenthil@gmail.com";
    const subject = "New Course is Waiting For Approval!";
    const htmlContent = `
      <h2>Course is waiting for the Approval</h2>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Price:</strong> ₹${pricing}</p>
      <p><strong>Mentor:</strong> ${mentorname}</p>
      <p><strong>Description:</strong> ${description}</p>
    `;
    await sendMail(toEmail, subject, htmlContent);
    res
      .status(200)
      .json({ message: "Course successfully posted and email sent" });
  } catch (err) {
    console.error("Error posting course:", err.message);
    res.status(500).json({ error: "Course failed to post" });
  }
};
const editCourse = async (req, res) => {
  try {
    const { _id, title, description, category, pricing } = req.body;
    await courseModel.findByIdAndUpdate(
      _id,
      { title, description, category, pricing },
      { new: true }
    );
    res.status(200).json({ message: "Course Updated Successfully" });
  } catch (err) {
    res.status(400), json({ error: "Course Updation failed" });
  }
};
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if course exists before deleting
    const course = await courseModel.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await courseModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ error: "Failed to delete course" });
  }
};
const getCourse = async (req, res) => {
  try {
    const course = await courseModel.find({});
    if (!course) {
      return res
        .status(200)
        .json({ message: "no course is there for pending" });
    }
    res.status(200).json(course);
  } catch (err) {
    res.status(400).json({ error: "fetching data failed" });
  }
};
const adminApproval = async (req, res) => {
  const { status } = req.body;
  const course = await courseModel.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  course.status = status;
  await course.save();

  res.status(200).json({ message: `Course ${status} successfully` });
};
const approvedCourse = async (req, res) => {
  try {
    const approved = await courseModel.find({ status: "approved" });
    res.status(200).json(approved);
  } catch (err) {
    res.status(400).json({ error: "fetching data failed" });
  }
};
const announcePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const findannounce = await announceModel.findOne({ content });
    if (findannounce) {
      return res.status(400).json({ error: "Anncouncement already Posted" });
    }
    await announceModel.create(req.body);
    return res
      .status(200)
      .json({ message: "Anncouncement Posted Successfully" });
  } catch (err) {
    return res.status(400).json({ error: "Anncouncement posting failed" });
  }
};
const announceget = async (req, res) => {
  try {
    const getannouncement = await announceModel.find(
      {},
      {
        _id: 1,
        title: 1,
        content: 1,
        createdAt: 1,
      }
    );
    return res.status(200).json(getannouncement);
  } catch (err) {
    return res.status(400).json({ error: "Anncouncement fetching failed" });
  }
};
const getCoursesstu = async (req, res) => {
  try {
    const courses = await courseModel.find({});
    return res.status(200).json(courses);
  } catch (err) {
    res.status(400).json({ error: "Fetching Courses Failed" });
  }
};
const addCartCourse = async (req, res) => {
  try {
    const { title, description, category, pricing, mentorname, _id } = req.body;

    const existingCourse = await cartModel.findOne({
      courseId: _id,
      userId: req.userId,
    });

    if (existingCourse) {
      return res
        .status(400)
        .json({ error: "This course is already added to your cart!" });
    }

    const cartItem = new cartModel({
      title,
      description,
      category,
      pricing,
      mentorname,
      courseId: _id,
      userId: req.userId,
    });
    await cartModel.create(cartItem);
    res.status(200).json({ message: "Course Added to Successfully" });
  } catch (err) {
    res.status(400).json({ error: "Course Failed to Add" });
  }
};
const getUserCart = async (req, res) => {
  try {
    const cartcourse = await cartModel.find({ userId: req.userId });
    res.status(200).json(cartcourse);
  } catch (err) {
    res.status(400).json({ error: "Fetching Courses Failed" });
  }
};
const feedbackPost = async (req, res) => {
  try {
    await feedbackModel.create(req.body);
    res.status(200).json({ message: "Feedback Posted Successfully" });
  } catch (err) {
    res.status(400).json({ error: "Feedback Posting Failed" });
  }
};
const getFeedbackDetails = async (req, res) => {
  try {
    const feedbacks = await feedbackModel.aggregate([
      {
        $addFields: {
          userObjId: { $toObjectId: "$userId" },
          courseObjId: { $toObjectId: "$courseId" },
        },
      },
      {
        $lookup: {
          from: "mentors",
          localField: "userObjId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },

      {
        $lookup: {
          from: "courses",
          localField: "courseObjId",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      { $unwind: "$courseInfo" },
      {
        $project: {
          _id: 1,
          feedback: 1,
          "userInfo.username": 1,
          "userInfo.email": 1,
          "courseInfo.title": 1,
          "courseInfo.category": 1,
          "courseInfo.mentorname": 1,
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(400).json({ error: "Fetching Feedback Failed" });
  }
};
const postQuestion = async (req, res) => {
  try {
    const { question, category, details } = req.body;
    await discussionModel.create({
      studentId: req.userId,
      question,
      category,
      details,
    });
    res.status(200).json({ message: "Question posted successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Posting question failed", details: err.message });
  }
};
const getDiscussions = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role === "mentor") {
      const mentorCourses = await courseModel.find({
        mentorname: user.username,
      });
      const mentorCategories = mentorCourses.map((course) => course.category);
      const discussions = await discussionModel
        .find({
          category: { $in: mentorCategories },
        })
        .sort({ createdAt: -1 });
      return res.status(200).json(discussions);
    }
    if (user.role === "student") {
      const studentDiscussions = await discussionModel
        .find({
          studentId: userId,
        })
        .sort({ createdAt: -1 });
      return res.status(200).json(studentDiscussions);
    }
    return res.status(403).json({ error: "Unauthorized access" });
  } catch (err) {
    return res.status(400).json({
      error: "Fetching Discussion Failed",
      details: err.message,
    });
  }
};
const postAnswer = async (req, res) => {
  try {
    const findquestion = await discussionModel.findById(req.params.id);
    const { answer, mentorname } = req.body;
    const mentorId = req.userId;
    if (!findquestion) {
      res.status(400).json({ error: "No Qusetion Found" });
    }
    findquestion.answer.push({
      mentorId,
      mentorname,
      answer,
    });
    await findquestion.save();
    return res.status(200).json({ message: "Reply Posted Successfully" });
  } catch (err) {
    return res.status(400).json({ error: "Reply Failed" });
  }
};
const uploadsFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { courseId, mentorname, title } = req.body;
    const pdfPath = `/uploads/${req.file.filename}`;

    if (!courseId || !mentorname || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newFile = new files({
      courseId,
      mentorname,
      title,
      pdf: pdfPath,
    });

    await newFile.save();

    res.status(201).json({
      message: "PDF uploaded successfully",
      data: newFile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading file", error });
  }
};
const getLesson = async (req, res) => {
  try {
    const lessons = await files.find({ courseId: req.params.courseId });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lessons", error });
  }
};
const disCount = async (req, res) => {
  try {
    const totaldiscount = await discussionModel.countDocuments();
    res.status(200).json(totaldiscount);
  } catch (err) {
    res.status(400).json({ error: "Fetching Error" });
  }
};
const questionpost = async (req, res) => {
  try {
    const { question } = req.body;
    const existquestion = await questionModel.findOne({ question });
    if (existquestion) {
      return res.status(400).json({ error: "Qusetion Already added" });
    }
    await questionModel.create(req.body);
    res.status(200).json({ message: "Question Posted Successfully" });
  } catch (err) {
    res.status(400).json({ error: "Question Posting Failed" });
  }
};
const getQuizQuestion = async (req, res) => {
  try {
    const getquiz = await questionModel.find();
    res.status(200).json(getquiz);
  } catch (err) {
    res.status(400).json({ error: "Fetching Failed" });
  }
};
const resultAnalytics = async (req, res) => {
  try {
    const { totalQuestion, score, accuracy } = req.body;
    await resultStatModel.create({
      userId: req.userId,
      totalQuestion,
      score,
      accuracy,
    });
    res.status(200).json({ message: "Answer Submitted Successfully" });
  } catch (err) {
    res.status(400).json({ error: "Answer Failed to Submit" });
  }
};
const getQuizResult = async (req, res) => {
  try {
    const result = await resultStatModel.aggregate([
      { $match: { userId: req.userId } },
      { $sort: { createdAt: -1 } },
      { $limit: 1 },
    ]);
    const attempt = await resultStatModel.countDocuments({userId:req.userId})
    res.status(200).json({
      ...(result[0] || {}),
      count: attempt
    });
  } catch (err) {
    res.status(400).json({error:'Fetching Results Failed'})
  }
};
const createPoll = async (req, res) => {
  try {
    const { question, options, multipleChoice, anonymous } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({ error: "Question and at least 2 options are required." });
    }

    const formattedOptions = options.map((opt, index) => ({
      optionId: opt.optionId || `${index + 1}`,
      text: opt.text || opt,
      votes: 0
    }));

    const newPoll = new pollModel({
      question,
      options: formattedOptions,
      multipleChoice: multipleChoice || false,
      anonymous: anonymous || false
    });

    await newPoll.save();
    res.status(201).json({ message: "Poll created successfully" });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ error: "Failed to create poll" });
  }
};
const getPolls = async (req, res) => {
  try {
    const polls = await pollModel.find().sort({ createdAt: -1 });
    res.status(200).json(polls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    res.status(500).json({ error: "Failed to fetch polls" });
  }
};
const deletePoll = async(req,res) => {
  try{
    await pollModel.findByIdAndDelete(req.params.id)
    return res.status(200).json({message:"Poll Deleted Successfully"})
  }catch(err){
    return res.status(400).json({error:"Poll Deleting Failed"})
  }
}
const votePoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { selected } = req.body;
    const userId = req.userId;
    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      return res.status(400).json({ error: "Selected option(s) are required." });
    }
    const poll = await pollModel.findById(pollId);
    if (!poll) return res.status(404).json({ error: "Poll not found." });
    if (poll.votedUser.includes(userId)) {
      return res.status(400).json({ error: "You have already voted on this poll." });
    }
    const selectedOptions = Array.isArray(selected) ? selected : [selected];
    if (!poll.multipleChoice && selectedOptions.length > 1) {
      return res.status(400).json({ error: "Multiple selections not allowed for this poll." });
    }
    poll.options.forEach(opt => {
      if (selectedOptions.includes(opt.optionId)) {
        opt.votes += 1;
      }
    });
    poll.votedUser.push(userId);
    poll.votedUserData = poll.votedUserData || [];
    poll.votedUserData.push({ userId, selectedOptionIds: selectedOptions });
    await poll.save();
    res.status(200).json({ message: "Vote recorded successfully"});
  } catch (error) {
    console.error("Vote Poll Error:", error);
    res.status(500).json({ error: "Failed to submit vote" });
  }
};
const messagePost = async(req,res) => {
  try{
    const {message} = req.body
    const userId = req.userId
    const user = await userModel.findById(userId)
    const newMessage = await messageModel.create({
      userId: userId,
      username: user.username,
      role: user.role,
      message: message,
    });
    return res.status(200).json({message:'Message Sent'})
  }catch(err){
    return res.status(400).json({error : 'Messgae Not Sent'})
  }
}
const getMessages = async(req,res) => {
  try{
    const message = await messageModel.find({})
    res.status(200).json(message)
  }catch(err){
    res.status(400).json({error:"Message Fetching Failed"})
  }
}
module.exports = {
  adminuser,
  adminadduser,
  userlogin,
  getUsers,
  deleteUsers,
  editForm,
  getUserscount,
  addCourse,
  getCourse,
  editCourse,
  deleteCourse,
  adminApproval,
  approvedCourse,
  announcePost,
  announceget,
  getCoursesstu,
  addCartCourse,
  getUserCart,
  feedbackPost,
  getFeedbackDetails,
  postQuestion,
  getDiscussions,
  postAnswer,
  uploadsFile,
  getLesson,
  lastcourse,
  disCount,
  questionpost,
  getQuizQuestion,
  resultAnalytics,
  getQuizResult,
  createPoll,
  getPolls,
  deletePoll,
  votePoll,
  messagePost,
  getMessages
};
