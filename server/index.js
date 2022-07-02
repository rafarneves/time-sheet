const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const HoursModel = require("./models/Hours");

app.use(express.json());
app.use(cors());

app.get("/read", (req, res) => {
  HoursModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }

    res.send(result);
  });
});

app.post("/insert", async (req, res) => {
  const date = req.body.date;
  const startHour = req.body.startHour;
  const finishHour = req.body.finishHour;

  const hour = new HoursModel({
    date: date,
    startHour: startHour,
    finishHour: finishHour,
  });

  try {
    await hour.save();
    res.send(hour);
  } catch (err) {
    console.log(err);
  }
});

app.put("/update", async (req, res) => {
  const newFinishHour = req.body.newFinishHour;
  const id = req.body.id;

  try {
    const hourId = await HoursModel.findById(id);
    hourId.finishHour = newFinishHour;
    hourId.save();
  } catch (err) {
    console.log(err);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await HoursModel.findByIdAndRemove(id).exec();

  res.send("Deleted");
});

mongoose
  .connect(
    "mongodb+srv://rafaarneves:finfo2009@cluster0.ko6muez.mongodb.net/pointAcess?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3001, () => {
      console.log("Server running on port 3001...");
    });
  })
  .catch((err) => console.log(err));
