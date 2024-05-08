import { NextFunction, Request, Response } from "express";

// Define your API key
const apiKey = "your_api_key_here";

// Middleware to check API key
export const apiKeyMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const providedApiKey = req.headers['x-api-key'];

  // Check if API key is provided and valid
  if (!providedApiKey || providedApiKey !== apiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // API key is valid, proceed to next middleware
  next();
};