const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const { generateItinerary } = require("../services/geminiService");

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

const createTrip = async (req, res) => {
  try {
    const { destination, durationDays, budgetTier, interests } = req.body;

    if (!destination || !durationDays || !budgetTier || !interests) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const aiResponse = await generateItinerary(
      destination,
      durationDays,
      budgetTier,
      interests
    );

    const cleaned = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const trip = await Trip.create({
      userId: req.user.id,
      destination,
      durationDays,
      budgetTier,
      interests,
      itinerary: parsed.itinerary || [],
      hotels: parsed.hotels || [],
      estimatedBudget: parsed.estimatedBudget || {},
      packingList: parsed.packingList || [],
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Could not create trip" });
  }
};

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getTripById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid trip ID" });
    }
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid trip ID" });
    }
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    await Trip.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const addActivity = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid trip ID" });
    }
    const { dayNumber, activity } = req.body;
    if (!dayNumber || !activity) {
      return res.status(400).json({ message: "dayNumber and activity are required" });
    }

    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const day = trip.itinerary.find((item) => item.dayNumber === dayNumber);
    if (!day) return res.status(404).json({ message: "Day not found" });

    day.activities.push(activity);
    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const removeActivity = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid trip ID" });
    }
    const { dayNumber, activityTitle } = req.body;
    if (!dayNumber || !activityTitle) {
      return res.status(400).json({ message: "dayNumber and activityTitle are required" });
    }

    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const day = trip.itinerary.find((item) => item.dayNumber === dayNumber);
    if (!day) return res.status(404).json({ message: "Day not found" });

    day.activities = day.activities.filter((activity) => activity.title !== activityTitle);
    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const regenerateDay = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid trip ID" });
    }
    const { dayNumber, instruction } = req.body;
    if (!dayNumber || !instruction) {
      return res.status(400).json({ message: "dayNumber and instruction are required" });
    }

    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const day = trip.itinerary.find((item) => item.dayNumber === dayNumber);
    if (!day) return res.status(404).json({ message: "Day not found" });

    day.activities = [
      { title: `Regenerated activity 1`, description: instruction, estimatedCostUSD: 0, timeOfDay: "Any" },
      { title: `Regenerated activity 2`, description: instruction, estimatedCostUSD: 0, timeOfDay: "Any" },
    ];

    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const optimizeBudget = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid trip ID" });
    }
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const currentTotal = trip.estimatedBudget.total || 0;
    const optimizedTotal = Math.round(currentTotal * 0.85);
    const savings = currentTotal - optimizedTotal;

    const recommendations = [
      "Book public transport passes.",
      "Choose lower-rated hotels for savings.",
      "Select free or low-cost attractions.",
      "Eat at local markets instead of tourist restaurants.",
    ];

    res.status(200).json({ currentTotal, optimizedTotal, savings, recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  deleteTrip,
  addActivity,
  removeActivity,
  regenerateDay,
  optimizeBudget,
};