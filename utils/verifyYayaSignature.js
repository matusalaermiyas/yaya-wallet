const crypto = require("crypto");

function verifyYayaSignature(payload, signature, secretKey) {
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(payload, "utf8")
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(hash, "hex")
  );
}

module.exports = {
  verifyYayaSignature,
};
