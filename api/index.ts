// Simple health-check endpoint for `/api/index`
// Main API routes are implemented as separate serverless functions:
// - `/api/register`
// - `/api/admin/login`
// - `/api/registrations`

export default function handler(req: any, res: any) {
  res.status(200).json({ ok: true, message: "Pixel Rush API index" });
}