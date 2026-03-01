const INTERNAL_ADMIN_TOKEN = "pixel_rush_admin_secure_token_123";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body || {};

  const validUsername = process.env.ADMIN_USERNAME || "admin";
  const validPassword = process.env.ADMIN_PASSWORD || "pixeladmin2024";

  if (username === validUsername && password === validPassword) {
    return res.status(200).json({ success: true, token: INTERNAL_ADMIN_TOKEN });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
}

