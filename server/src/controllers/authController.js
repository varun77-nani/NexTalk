import * as authService from "../services/authService.js";
import { setAuthCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
  const result = await authService.signup(req.body);
  setAuthCookie(res, result.token);
  res.status(201).json({ user: result.user });
}

export async function login(req, res) {
  const result = await authService.login(req.body);
  setAuthCookie(res, result.token);
  res.json({ user: result.user });
}

export function logout(_req, res) {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  res.json({ message: "Logged out" });
}

export async function getMe(req, res) {
  res.json({ user: await authService.getMe(req.user.id) });
}
