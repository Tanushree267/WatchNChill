import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // user is string (matches User._id type)
    user: { type: String, ref: "User", required: true },

    // show is an ObjectId referencing the Show document inserted during seeding
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },

    amount: { type: Number, required: true },

    // seats array
    bookedSeats: { type: [String], required: true },

    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;