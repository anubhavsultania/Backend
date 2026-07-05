import path from "path";
import bcrypt from "bcrypt";
import { registerUserInDb } from "../services/authServices.js";
import { authenticateUser } from "../services/authServices.js";
import { rootDir } from "../utils/path.js";

export function getLoginPage(req, res, next) {
  return res.sendFile(path.join(rootDir, "../public", "login.html"));
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    req.session.userId = user.id;
    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
}

export function getRegisterPage(req, res) {
  return res.sendFile(path.join(rootDir, "../public", "register.html"));
}

export async function registerUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const userId = await registerUserInDb(email, password);
    req.session.userId = userId;
    req.session.save((err) => {
      if (err) return next(err);
      res.redirect("/dashboard");
    });
  } catch (error) {
    next(error);
  }
}

export function logoutUser(req, res, next) {
  try {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}
