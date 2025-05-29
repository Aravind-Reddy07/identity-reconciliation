import contactModel from "../models/contact.model.js";
import { getPrimaryContact } from "../utils/contactUtils.js";

const identifyContact = async (req, res, next) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber)
      return res.status(400).json({ error: "Email or phoneNumber required" });

    let existingContacts = await contactModel.getContactsByEmailOrPhone(
      email,
      phoneNumber
    );
    let primary = null;
    let all = [...existingContacts];

    if (existingContacts.length === 0) {
      const newContact = await contactModel.createContact(
        email,
        phoneNumber,
        null,
        "primary"
      );
      primary = newContact;
      all = [newContact];
    } else {
      const alreadyExists = existingContacts.find(
        (c) => c.email === email && c.phoneNumber === phoneNumber
      );

      primary = getPrimaryContact(existingContacts);

      if (!alreadyExists) {
        const newContact = await contactModel.createContact(
          email,
          phoneNumber,
          primary.id,
          "secondary"
        );
        all.push(newContact);
      }

      for (const contact of all) {
        if (contact.linkPrecedence === "primary" && contact.id !== primary.id) {
          await contactModel.updateContact(contact.id, {
            linkPrecedence: "secondary",
            linkedId: primary.id,
          });
          contact.linkPrecedence = "secondary";
          contact.linkedId = primary.id;
        }
      }

      const updatedContacts = await contactModel.getContactsByEmailOrPhone(
        email,
        phoneNumber
      );
      all = [...existingContacts, ...updatedContacts];
    }

    const primaryId = primary.id;
    const emails = [...new Set(all.map((c) => c.email).filter(Boolean))];
    const phoneNumbers = [
      ...new Set(all.map((c) => c.phoneNumber).filter(Boolean)),
    ];
    const secondaryIds = all
      .filter(
        (c) => c.linkPrecedence === "secondary" && c.linkedId === primaryId
      )
      .map((c) => c.id);

    return res.status(200).json({
      contact: {
        primaryContatctId: primaryId,
        emails,
        phoneNumbers,
        secondaryContactIds: secondaryIds,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default { identifyContact };
