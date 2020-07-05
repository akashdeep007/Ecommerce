export default {
  MONGODB_URL:
    process.env.MONGODB_URL ||
    "mongodb+srv://akashdeep:Dyhal9Jo06NVc7GU@cluster0-dosbk.mongodb.net/Ecommerce?retryWrites=true&w=majority",
  JWT_SECRET: process.env.JWT_SECRET || "somethingsecret",
};
