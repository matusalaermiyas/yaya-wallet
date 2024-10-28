require("dotenv").config();

const PORT = process.env.PORT || 8080;

const express = require("express");
const {
  getProfile,
  getTransactionListByUser,
} = require("@yayawallet/node-sdk");

const {
  verifyYayaSignature,
  createSignedString,
} = require("./utils/verifyYayaSignature");

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
  try {
    const payload = req.body;
    const signedString = createSignedString(payload);
    const yaYaSignature = req.headers["yaya-signature"];
    // const timestamp = req.headers['yaya-timestamp'];

    if (!verifyYayaSignature(signedString, yaYaSignature)) {
      console.log("'Invalid signature'");

      return res.status(400).send("Invalid signature");
    }

    console.log("Verified event:", payload);
    res.status(200).send("Event received");
  } catch (error) {
    console.error("err", error);
  }
});

app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
