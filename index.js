require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Note = require("./models/note");

const app = express();
app.use(cors());
app.use(express.static("dist"));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.post("/api/notes", async (request, response, next) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  try {
    const savedNote = await note.save();
    response.json(savedNote);
  } catch (error) {
    next(error);
  }
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/api/notes/:id", async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);
    if (note) response.json(note);
    else response.status(404).end();
  } catch (error) {
    next(error);
  }
});

app.put("/api/notes/:id", async (request, response, next) => {
  const { content, important } = request.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id,
      { content, important },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    response.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
