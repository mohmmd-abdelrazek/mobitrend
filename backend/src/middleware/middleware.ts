import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";

export const validateEmail = [
  body("email").isEmail().withMessage("Invalid email address."),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateSignup = [
  body("name").trim().not().isEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Invalid email address."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("user: ", req.user)
  console.log("---");
  next();
};

export const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "invalid token",
    });
  }

  next(error);
};

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;
  if (req.isAuthenticated() && userRole === "admin") {
    return next();
  }
  res.status(403).json({ error: "Insufficient rights" });
};