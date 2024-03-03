const mongoose = require("mongoose");
const config = require("./utils/config");
const Note = require("./models/note");

mongoose.set("strictQuery", false);

mongoose.connect(config.MONGODB_URI);

const newNote = new Note({
  content: "asdasdfasdfasdf",
  important: true,
});

newNote.save().then((note) => {
  console.log(note);
  mongoose.connection.close();
});

// Note.find({}).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });
