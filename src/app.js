const express = require("express");
const cors = require("cors");
const { welcome, addNote, getNote, getDetailNote, deleteNote, editNote, addAccount, getAccount, searchNote, addPin, deletePin } = require("./function");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server berjalan pada http://localhost:${PORT}`);
});

app.get("/", welcome);
app.post("/addNote", addNote);
app.get("/note/:user_id", getNote);
app.get("/note/:user_id/:note_id", getDetailNote);
app.patch("/editNote/:user_id/:note_id", editNote);
app.patch("/addPin/:user_id/:note_id", addPin);
app.patch("/deletePin/:user_id/:note_id", deletePin);
app.delete("/deleteNote/:user_id/:note_id?", deleteNote);
app.get("/searchNote", searchNote)
app.get("/account/:user_id", getAccount);
app.post("/addAccount", addAccount);