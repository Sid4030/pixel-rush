import app from "../src/index";

export const config = {
  api: { bodyParser: false },
};

export const runtime = "nodejs";

export default function handler(req: any, res: any) {
  return app(req, res);
}