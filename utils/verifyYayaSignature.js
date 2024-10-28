const crypto = require("crypto");

function verifySignature(signedString, headerSignature) {
  const computedSignature = crypto
    .createHmac("sha256", process.env.YAYA_SECRET_KEY)
    .update(signedString)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(computedSignature, "utf8"),
    Buffer.from(headerSignature, "utf8")
  );
}

function createSignedString(payload) {
  const values = [];
  function extractValues(obj) {
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        extractValues(obj[key]);
      } else {
        values.push(String(obj[key]));
      }
    }
  }
  extractValues(payload);
  return values.join("");
}

module.exports = {
  verifySignature,
  createSignedString,
};
