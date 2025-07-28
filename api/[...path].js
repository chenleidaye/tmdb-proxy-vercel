export default async function handler(req, res) {
  const { TMDB_API_KEY = "" } = process.env;

  // 检查路径是否包含 image.tmdb.org
  if (req.query.path[0] === "image.tmdb.org") {
    const imageUrl = `https://${req.query.path.join("/")}`;
    try {
      const imageResponse = await fetch(imageUrl);
      res.setHeader("Content-Type", imageResponse.headers.get("Content-Type"));
      imageResponse.body.pipe(res); // 转发图片
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  // 处理 TMDB API 请求
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
