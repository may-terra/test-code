// server.ts (Backend File)

import express, { Request, Response } from "express";

const app = express();
const port = 3000;

// This defines a simple API endpoint (backend logic)
app.get("/api/hello", (req: Request, res: Response) => {
  // It returns JSON data, not a UI component
  res.json({ message: "Hello from the backend API!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
