/*
  Form routes
  host + /api/form
*/

const { Router } = require("express");
const { check } = require("express-validator");
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

const router = Router();

router.get("/hubspot/contacts", async (req, res) => {
  const hubspotClient = new hubspot.Client({
    accessToken: `${process.env.ACCESS_TOKEN}`,
  });
  const limit = 100;
  const contacts = await hubspotClient.crm.contacts.basicApi.getPage(limit);
  res.json({
    message: contacts,
  });
});

router.post(
  "/hubspot/contact",
  [
    check("firstname", "Name is required").not().isEmpty(),
    check("lastname", "Lastname is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("phone", "Password is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("website", "Website is required").not().isEmpty(),
  ],
  async (req, res) => {
    const { firstname, lastname, email, phone, website, company } = req.body;
    const hubspotClient = new hubspot.Client({
      accessToken: `${process.env.ACCESS_TOKEN}`,
    });
    try {
      const contact = await hubspotClient.crm.contacts.basicApi.create({
        properties: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          phone: phone,
          website: website,
          company: company,
        },
        lifecycleStage: "customer",
      });
      res.json({
        message: contact,
      });
    } catch (error) {
      res.json({
        message: error,
      });
    }
  }
);

router.post("/captcha", (req, res) => {
  const { token } = req.body;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${token}`;

  axios
    .post(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
    })
    .then((response) => {
      res.json({
        message: response.data,
      });
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
});

module.exports = router;
