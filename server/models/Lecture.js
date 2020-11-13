class Lecture {
  constructor(
    id,
    name,
    start,
    end,
    capacity,
    booked_students,
    course,
    lecturer
  ) {
    Object.assign(this, {
      id,
      name,
      start,
      end,
      capacity,
      booked_students,
      course,
      lecturer,
    });
  }
}
