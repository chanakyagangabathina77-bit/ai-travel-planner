const express = require("express");

const router = express.Router();

const {
  createTrip,
  getTrips,
  getTripById,
  deleteTrip,
  addActivity,
  removeActivity,
  regenerateDay,
  optimizeBudget,
} = require("../controllers/tripController");

router.get("/test", (req, res) => {
  res.json({
    message: "Trip routes working",
  });
});

const {
  protect,
} = require("../middleware/authMiddleware");

router.post("/", protect, createTrip);

router.get("/", protect, getTrips);

router.get("/:id", protect, getTripById);

router.delete("/:id", protect, deleteTrip);

router.put(
  "/:id/add-activity",
  protect,
  addActivity
);

router.put(
  "/:id/remove-activity",
  protect,
  removeActivity
);

router.put(
  "/:id/regenerate-day",
  protect,
  regenerateDay
);

router.get(
  "/:id/optimize-budget",
  protect,
  optimizeBudget
);

module.exports = router;