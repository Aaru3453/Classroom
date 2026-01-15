import express from "express";
import {
  getTimetables,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} from "../controllers/timetableController.js";

const router = express.Router();

router.get("/", getTimetables);
router.post("/", createTimetable);
router.put("/:id", updateTimetable);
router.delete("/:id", deleteTimetable);

export default router;
