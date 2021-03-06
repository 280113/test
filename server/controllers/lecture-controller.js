const moment = require("moment");
const knex = require("./../db");

//Get all available bookings by one student before deadline
exports.getBookingLectures = async (req, res) => {
  const studentId = req.user && req.user.id;
  today = moment().format("YYYY-MM-DD HH:mm:ss");
  deadline = moment(today).add(12, "hours");
  dateShown = moment(today).add(2, "weeks");
  console.log(today);
  console.log(deadline);

  knex
    //.select(knex.raw('lecture.id, name, course, lecturer, start, end, capacity, count(*) as booked_students'))
    .select(
      { lecture_id: "lecture.id" },
      { name: "name" },
      { course: "course" },
      { start: "start" },
      { end: "end" },
      { capacity: "capacity" }
    )
    .from("lecture")
    .join(
      "lecture_booking",
      "lecture.id",
      "=",
      "lecture_booking.lecture_id"
    )
    .join(
      "course_available_student",
      "lecture.course",
      "=",
      "course_available_student.course_id"
    )
    .whereNotIn("lecture.id", function () {
      //don't select the lectures already booked
      this.select("lecture_id")
        .from("lecture_booking")
        .where("student_id", studentId);
    })
    .andWhere("course_available_student", studentId) //select only lectures that student can attend
    .andWhere("start", ">", deadline) //deadline (before 12 hours)
    .andWhere("start", "<", dateShown) //show only lecture in two weeks
    .groupBy("lecture.id")
    .count("* as booked_students")
    .then((queryResults) => {
      res.json(queryResults);
    })
    .catch((err) => {
      res.json({
        message: `There was an error retrieving the student's lectures: ${err}`,
      });
    });
};

//Get existent bookings by one student
exports.getExistentBooking = async (req, res) => {
  const studentId = req.user && req.user.id;
  const today = moment().format("YYYY-MM-DD HH:mm:ss");
  const dateShown = moment(today).add(2, "weeks");
  console.log(today);

  knex
    .select(
      { lecture_id: "lecture.id" },
      { name: "name" },
      { course: "course" },
      { start: "start" },
      { end: "end" },
      { capacity: "capacity" },
      { booked_at: "booked_at" }
    )
    .from("lecture")
    .join(
      "lecture_booking",
      "lecture.id",
      "=",
      "lecture_booking.lecture_id"
    )
    .where("lecture.student_id", studentId)
    .andWhere("start", ">", today) //show only future lectures
    .andWhere("start", "<", dateShown) //show only lecture in two weeks
    .then((queryResults) => {
      res.json(queryResults);
    })
    .catch((err) => {
      res.json({
        message: `There was an error retrieving the student's lectures: ${err}`,
      });
    });
};

//Insert new booking of a lecture

exports.newBooking = async (req, res) => {
  // Insert new booking from table lecture_booking
  const studentId = req.user && req.user.id;
  console.log(req.user);
  today = moment().format("YYYY-MM-DD HH:mm:ss");

  knex("lecture_booking")
    .insert({
      // insert new record
      lecture_id: req.params.lectureId,
      student_id: studentId, //idstudent
      booked_at: today, //time
    })
    .then(() => {
      // Send a success message in response
      res.json({ message: `Booking created.` });
    })
    .catch((err) => {
      // Send a error message in response
      res.json({ message: `There was an error creating the booking` });
    });
};
