import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    // movie references Movie._id (Movie._id is a string in your seeded data)
    movie: { type: String, ref: "Movie", required: true },

    // stored as Date type (seeded ISO string will convert to Date)
    showDateTime: { type: Date, required: true },

    showPrice: { type: Number, required: true },

    // changed from Object to array of strings (seat ids like "A1", "B3")
    occupiedSeats: { type: [String], default: [] },
  },
  { minimize: false } // keep as you had it (if you need to store empty objects elsewhere)
);

const Show = mongoose.model("Show", showSchema);

export default Show;