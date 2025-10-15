import express from "express";
import router from "@/router/router";
import cors from "cors";
import { logger } from "@/logger";

const port = 3000;

const app = express();

app.use(express.json()); // Middleware to parse JSON data
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors())


// TODO: get some better logging
app.use((req, _, next) => {
    logger.info("New request received:", req.method, req.url, req.body);
    next();
});

app.use("/", router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
