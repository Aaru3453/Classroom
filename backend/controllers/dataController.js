// import Data from "../models/DataModel.js";

// // GET all data
// export const getAllData = async (req, res) => {
//     try {
//         const data = await Data.find();
//         res.json(data);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // POST new data
// export const createData = async (req, res) => {
//     try {
//         // Old chat ke base pe, purana data remove karna
//         await Data.deleteMany({});

//         const newData = new Data(req.body);
//         await newData.save();
//         res.status(201).json(newData);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };




const Data = require("../models/DataModel");

exports.getAllData = async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createData = async (req, res) => {
  try {
    await Data.deleteMany({});
    const newData = await Data.create(req.body);
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
