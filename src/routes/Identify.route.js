import express from "express";
import contactController from '../controllers/Contact.controller.js';

const router = express.Router();

router.post("/identify", contactController.identifyContact);

export default router;
