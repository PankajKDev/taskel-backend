require("dotenv").config();
const express = require("express");
const prisma = require("./utils/db");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 4000;
//routes
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const userRoutes = require("./routes/user.route");
const healthRoutes = require("./routes/healthcheck.routes");
const authMiddleware = require("./middleware/auth.middleware");

app.use(express.json());
app.use(cookieParser());

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/tasks", authMiddleware, taskRoutes);
app.use("/user", authMiddleware, userRoutes);

async function main() {
  try {
    await prisma.$connect(); //Eager check to ensure everything is fine
    app.listen(PORT, () => {
      console.log(
        `server running at ${
          process.env.NODE_ENV == "dev"
            ? `http://localhost:${PORT}`
            : process.env.BASE_DOMAIN
        } `
      );
    });
  } catch (error) {
    console.log(`Eager check failed`);
    process.exit(1);
  }
}

main();
