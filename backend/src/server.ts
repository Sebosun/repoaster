import express from "express";
import router from "../router/router";
import cors from "cors";

const port = 3000;

const app = express();

app.use(express.json()); // Middleware to parse JSON data
app.use(cors());

app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
