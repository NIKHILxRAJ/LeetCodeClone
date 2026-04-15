const { createClient } = require("redis");

const redisclient = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-15532.c326.us-east-1-3.ec2.cloud.redislabs.com",
    port: 15532
  }
});

/* Handle Redis Events */
redisclient.on("connect", () => {
  console.log("redis connected");
});

redisclient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisclient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

/* Connect Redis */
(async () => {
  try {
    await redisclient.connect();
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

module.exports = redisclient;