export default async function handler(req, res) {
  const { TMDB_API_KEY = "" } = process.env;

  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: "TMDB_API_KEY not set" });
  }

  const path = req.query.path.join("/");
  const params = new URLSearchParams(req.query);
  params.set("api_key", TMDB_API_KEY);
  params.set("language", "zh-CN");

  const url = `https://api.themoviedb.org/3/${path}?${params.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
