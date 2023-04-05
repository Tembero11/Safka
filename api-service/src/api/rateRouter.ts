import { Router } from "express";
import { currentMenu, db } from "../index";


const router = Router();

router.post("/v1/rate", async(req, res) => {
    const reviewsCollection = db.collection("reviews");

    const today = new Date();
    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());


    const todayMenu = await reviewsCollection.findOne({ date: todayWithoutTime });

    res.json(todayMenu);
});


export default router; 