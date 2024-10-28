require("dotenv").config();

const PORT = process.env.PORT || 8080;

const express = require("express");
const {
  getProfile,
  getTransactionListByUser,
} = require("@yayawallet/node-sdk");
const app = express();

app.get("/", (req, res) => res.send("Welcome to yaya"));

app.get("/profile", async (req, res) => {
  try {
    const profile = await getProfile();

    console.log("Viewing profile");

    return res.send(profile);
  } catch (error) {
    return res.status(500).send({ message: "Error" });
  }
});

app.get("/transactions", async (req, res) => {
  try {
    const transactions = await getTransactionListByUser();

    return res.send(transactions);
  } catch (error) {
    return res.status(500).send({ message: "Error" });
  }
});

app.post("/webhook", (req, res) => {
  console.log("Getting into hook");

  const payload = JSON.stringify(req.body); // Convert JSON payload to string
  const yayaSignature = req.headers["yaya-signature"]; // Retrieve YAYA-SIGNATURE header

  // Verify the signature
  if (
    verifyYayaSignature(payload, yayaSignature, process.env.YAYA_SECRET_KEY)
  ) {
    console.log("Signature verified successfully!");
    // Process the event
    res.status(200).send("Event received and verified");
  } else {
    console.error("Invalid signature. Request not verified.");
    res.status(403).send("Forbidden: Signature verification failed");
  }
});

app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
