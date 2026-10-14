const { randomUUID } = require("crypto");

// Same Codashop endpoint the community codm-api used; called directly because that service stopped working.
const CODASHOP_VALIDATE_URL = "https://order-sg.codashop.com/validate";
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

function reply(statusCode, body) {
  return { statusCode, headers: JSON_HEADERS, body: JSON.stringify(body) };
}

async function validate(userId, country) {
  const response = await fetch(CODASHOP_VALIDATE_URL, {
    method: "POST",
    headers: { "content-type": "application/json", "accept": "application/json" },
    body: JSON.stringify({ country, voucherTypeName: "CALL_OF_DUTY_MOBILE_WL", whiteLabelId: "1", deviceId: randomUUID(), userId })
  });
  const text = await response.text();
  try { return JSON.parse(text); } catch (_) { return null; }
}

exports.handler = async function (event) {
  const name = (event.queryStringParameters && event.queryStringParameters.name || "").trim();
  if (!name || name.length > 40) {
    return reply(400, { error: "Enter a player nickname (max 40 characters)." });
  }
  try {
    let country = "IN";
    let data = await validate(name, country);
    // Codashop answers with the player's home country when it differs; retry once with that country.
    if (data && data.errorCode === -200 && data.homeBaseCountry2Name) {
      country = data.homeBaseCountry2Name;
      data = await validate(name, country);
    }
    if (!data) return reply(502, { error: "The CODM profile service returned an unreadable response." });
    if (data.success === false || !data.result) {
      return reply(404, { success: false, error: data.errorMsg || data.errorMessage || "Player not found" });
    }
    const result = data.result;
    return reply(200, { success: true, data: { ...result, nickname: result.nickname || result.username, country } });
  } catch (error) {
    return reply(502, { error: "Could not reach the CODM profile service." });
  }
};
