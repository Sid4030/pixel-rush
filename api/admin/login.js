const INTERNAL_ADMIN_TOKEN = "pixel_rush_admin_secure_token_123";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password } = req.body || {};

  const validUsername = process.env.ADMIN_USERNAME ;
  const validPassword = process.env.ADMIN_PASSWORD ;

  if (username === validUsername && password === validPassword) {
    return res
      .status(200)
      .json({ success: true, token: INTERNAL_ADMIN_TOKEN });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
}

