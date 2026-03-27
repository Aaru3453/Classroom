// import express from "express";
// import { getAllData, createData } from "../controllers/dataController.js";

// const router = express.Router();

// router.get("/", getAllData);
// router.post("/", createData);

// export default router;



const express = require("express");
const router = express.Router();

const {
  getAllData,
  createData
} = require("../controllers/dataController");

router.get("/", getAllData);
router.post("/", createData);

module.exports = router;
