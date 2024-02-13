import express from "express";

const router = express.Router();

router.get("", async (req, res) => {
  if (!req.body.message) {
    res.status(400);
    res.json({ message: "Missing message" });
    return;
  }
});

export default router;
