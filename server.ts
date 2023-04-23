// express test server with one test endpoint (use typescript)
import express from "express";
import { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
