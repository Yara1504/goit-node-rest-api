import contactsService from "../services/contactsServices.js";
import {
    createContactSchema,
    updateContactSchema,
} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
    const allContacts = await contactsService.listContacts();
    res.status(200).json(allContacts);
};

export const getOneContact = async (req, res, next) => {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (contact) {
        res.status(200).json(contact);
    }
    throw HttpError(404, error.message);
};

export const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    const deleteContact = await contactsService.removeContact(id);
    if (deleteContact) {
        res.status(200).json(deleteContact);
    }
    throw HttpError(404, error.message); 
};

export const createContact = async (req, res, next) => {
    const { name, email, phone } = req.body;
    await createContactSchema.validateAsync({ name, email, phone });

    const addContact = await contactsService.addContact(name, email, phone);
    if (addContact) {
        res.status(201).json(addContact);
    }
};

export const updateContact = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    
    if (Object.keys(data).length === 0) {
        res.status(400).json({ "message": "Body must have at least one field" });
    }
    await updateContactSchema.validateAsync(data);

    const updateContact = await contactsService.updateContact(id, data);
    if (updateContact) {
        res.status(200).json(updateContact);
    }
};
