import httpStatus from "http-status";
import { Meeting } from "../models/meetingModel.js";

const addToActivity = async (req, res) => {
  const { user_id, meetingCode } = req.body;

  try {
    const newMeeting = new Meeting({
      user_id,
      meetingCode,
    });
    await newMeeting.save();
    res.status(httpStatus.CREATED).json({ message: "Meeting added to activity" });
  } catch (e) {
    res.status(500).json({ message: `Something went wrong: ${e}` });
  }
};

const getAllActivity = async (req, res) => {
  const { user_id } = req.params;

  try {
    const meetings = await Meeting.find({ user_id }).sort({ date: -1 });
    res.status(httpStatus.OK).json(meetings);
  } catch (e) {
    res.status(500).json({ message: `Something went wrong: ${e}` });
  }
};

export { addToActivity, getAllActivity };