require("dotenv").config();

const PORT = process.env.PORT || 8080;

const express = require("express");
const {
  getProfile,
  getTransactionListByUser,
  createTransaction,
} = require("@yayawallet/node-sdk");
const app = express();

app.get("/profile", async (req, res) => {
  try {
    const profile = await getProfile();

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

app.post("/transactions", async (req, res) => {
  try {
    const transactions = await createTransaction(
      "11546a58-04c2-4b67-aba8-cc7ffacc8c6b",
      10,
      "sandbox"
    );

    return res.send(transactions);
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "Error" });
  }
});

app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
