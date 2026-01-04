import Contact from "../models/Contact.js";
import { isValidEmail, isValidMobile } from "../utils/validators.js";

/* ===============================
   CREATE CONTACT (POST)
================================ */
// export const createContact = async (req, res) => {
//   try {
//     const { fullName, email, contactNumber, subject, message } = req.body;

//     // 🔒 Validation
//     if (!fullName || !email || !contactNumber || !subject || !message) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const contact = await Contact.create({
//       fullName,
//       email,
//       contactNumber,
//       subject,
//       message,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Message sent successfully",
//       data: contact,
//     });
//   } catch (error) {
//     console.error("CREATE CONTACT ERROR:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };

/* ===============================
   CREATE CONTACT (POST)
================================ */
export const createContact = async (req, res) => {
  try {
    const { fullName, email, contactNumber, subject, message } = req.body;

    // 🔒 Validation
    if (!fullName || !email || !contactNumber || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ❌ Invalid email → silently ignore
    if (!isValidEmail(email)) {
      return res.status(200).json({ success: true });
    }

    // ❌ Invalid mobile → silently ignore
    if (!isValidMobile(contactNumber)) {
      return res.status(200).json({ success: true });
    }

    // ✅ Store only VALID data
    await Contact.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      contactNumber: contactNumber.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    // ❌ Even server error → no leak
    console.error("CREATE CONTACT ERROR:", error.message);

    return res.status(200).json({
      success: true,
    });
  }
};

/* ===============================
   GET ALL CONTACTS (ADMIN)
================================ */
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("GET ALL CONTACTS ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/* ===============================
   GET SINGLE CONTACT
================================ */
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("GET CONTACT BY ID ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/* ===============================
   UPDATE CONTACT
   (Mark Read / Update Fields)
================================ */
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Allow only safe fields to update
    const allowedUpdates = {
      isRead: req.body.isRead,
    };

    const contact = await Contact.findByIdAndUpdate(id, allowedUpdates, {
      new: true,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("UPDATE CONTACT ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/* ===============================
   DELETE CONTACT
================================ */
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CONTACT ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
