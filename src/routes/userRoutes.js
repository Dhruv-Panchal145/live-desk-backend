import { Router } from "express";
import { login, register } from "../controllers/userController.js";
import { addToActivity, getAllActivity } from "../controllers/meetingController.js";


const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity").post(addToActivity);
router.route("/get_all_activity/:user_id").get(getAllActivity);  


export default router;