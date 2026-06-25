export default function handler(req, res) {
  return res.status(200).json({
    status: "ok",
    brand: "Fitness Mantra",
    message: "API root is working. Use /api/ai-coach for AI Coach."
  });
}
