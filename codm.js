exports.handler = async function (event) {
  const name = (event.queryStringParameters && event.queryStringParameters.name || "").trim();
  if (!name || name.length > 40) {
    return { statusCode: 400, headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ error: "Enter a player nickname (max 40 characters)." }) };
  }
  try {
    const url = "https://callofdutymobile.vercel.app/user/" + encodeURIComponent(name);
    const upstream = await fetch(url, { headers: { "accept": "application/json" } });
    const body = await upstream.text();
    let data;
    try { data = JSON.parse(body); } catch (_) {
      return { statusCode: 502, headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ error: "The CODM profile service returned an unreadable response." }) };
    }
    return { statusCode: upstream.ok ? 200 : upstream.status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: 502, headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ error: "Could not reach the unofficial CODM profile service." }) };
  }
};
