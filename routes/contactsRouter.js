import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../middlewares/validateBody.js"
import { validId } from "../middlewares/validId.js";
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, validId, getOneContact);

contactsRouter.delete("/:id", authenticate, validId, deleteContact);

contactsRouter.post("/", authenticate, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", authenticate, validateBody(updateContactSchema), validId, updateContact);

contactsRouter.patch("/:id/favorite", authenticate, validateBody(updateContactSchema), validId, updateStatusContact);


export default contactsRouter;
