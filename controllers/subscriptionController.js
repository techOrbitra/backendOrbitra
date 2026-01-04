import Subscription from "../models/Subscription.js";
import { isValidEmail } from "../utils/validators.js";

/* ===============================
   SUBSCRIBE EMAIL (POST)
================================ */
export const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // ❌ Missing or invalid → silently ignore
    if (!email || !isValidEmail(email)) {
      return res.status(200).json({ success: true });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ❌ Already exists → silently ignore
    const exists = await Subscription.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(200).json({ success: true });
    }

    // ✅ Save new subscription
    await Subscription.create({ email: normalizedEmail });

    return res.status(200).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.error("SUBSCRIPTION ERROR:", error.message);

    // ❌ No error leak
    return res.status(200).json({ success: true });
  }
};

/* ===============================
   GET ALL SUBSCRIBERS (ADMIN)
================================ */
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscription.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    console.error("GET SUBSCRIBERS ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* ===============================
   DELETE SUBSCRIBER
================================ */
export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    await Subscription.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Subscriber removed",
    });
  } catch (error) {
    console.error("DELETE SUBSCRIBER ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
