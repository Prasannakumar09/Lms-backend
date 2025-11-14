const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const verifytoken = require("../middleware/verifyToken");
const upload = require("../middleware/file");

router.post("/login", controller.userlogin);
router.post("/addadmin", controller.adminuser);
router.post("/addAdminUsers", controller.adminadduser);
router.get("/getUsers", verifytoken, controller.getUsers);
router.get("/latestcourse", verifytoken, controller.lastcourse);
router.delete("/deleteUsers/:id", verifytoken, controller.deleteUsers);
router.patch("/editform", verifytoken, controller.editForm);
router.get("/getusercount", verifytoken, controller.getUserscount);
router.post("/addcourse", verifytoken, controller.addCourse);
router.get("/courseapprove", verifytoken, controller.getCourse);
router.patch("/editcourse", verifytoken, controller.editCourse);
router.delete("/deletecourse/:id", verifytoken, controller.deleteCourse);
router.post("/adminapproval/:id", verifytoken, controller.adminApproval);
router.get("/approvedcourses", verifytoken, controller.approvedCourse);
router.post("/announcepost", verifytoken, controller.announcePost);
router.get("/announceget", verifytoken, controller.announceget);
router.get("/getcourses", verifytoken, controller.getCoursesstu);
router.post("/courseaddtocart", verifytoken, controller.addCartCourse);
router.get("/usercoursecart", verifytoken, controller.getUserCart);
router.post("/feedbackpost", verifytoken, controller.feedbackPost);
router.get("/getfeedback", verifytoken, controller.getFeedbackDetails);
router.post("/postquestion", verifytoken, controller.postQuestion);
router.get("/getdiscussion", verifytoken, controller.getDiscussions);
router.post("/answerpost/:id", verifytoken, controller.postAnswer);
router.post(
  "/lessonpost",
  verifytoken,
  upload.single("pdf"),
  controller.uploadsFile
);
router.get("/getpdfs/:courseId", verifytoken, controller.getLesson);
router.get("/getdiscount", verifytoken, controller.disCount);
router.post("/quizquestionpost", verifytoken, controller.questionpost);
router.get("/getquizquestions", verifytoken, controller.getQuizQuestion);
router.post("/quizresult", verifytoken, controller.resultAnalytics);
router.get("/quizanalyticresult", verifytoken, controller.getQuizResult);
router.post("/createpoll", verifytoken, controller.createPoll);
router.get("/getpoll", verifytoken, controller.getPolls);
router.delete("/deletepoll/:id", verifytoken, controller.deletePoll);
router.post("/:pollId/vote", verifytoken, controller.votePoll);
router.post("/messagepost", verifytoken, controller.messagePost);
router.get("/getmessages", verifytoken, controller.getMessages);

module.exports = router;
