import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Classroom name is required"],
      unique: true,
      trim: true,
    },
    building: {
      type: String,
      required: [true, "Building is required"],
      enum: [
        "IT Building",
        "Main Academic Building",
        "Science Building",
        "Engineering Building",
        "Humanities Block",
        "Library Building",
      ],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: 1,
      max: 500,
    },
    type: {
      type: String,
      required: [true, "Classroom type is required"],
      enum: [
        "Lecture Hall",
        "Lab",
        "Seminar Room",
        "Auditorium",
        "Tutorial Room",
      ],
    },
    equipment: [
      {
        type: String,
        enum: [
          "Projector",
          "Smart Board",
          "Computers",
          "Sound System",
          "Lab Equipment",
          "Whiteboard",
          "Video Conference",
          "Air Conditioning",
          "Network",
          "WiFi",
        ],
      },
    ],
    availability: {
      type: String,
      enum: ["Available", "In Use", "Under Maintenance"],
      default: "Available",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Classroom = mongoose.model("Classroom", classroomSchema);
export default Classroom;
