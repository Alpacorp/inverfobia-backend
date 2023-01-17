/*
  Form routes
  host + /api/form
*/

const { Router } = require("express");
const { check } = require("express-validator");
const hubspot = require("@hubspot/api-client");

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
  ],
  async (req, res) => {
    const { firstname, lastname, email, phone } = req.body;
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

module.exports = router;
