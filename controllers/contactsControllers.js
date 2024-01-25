import contactsService from "../services/contactsServices.js";
import {
    createContactSchema,
    updateContactSchema,
} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
    const allContacts = await contactsService.listContacts();
    res.json(allContacts);
};

export const getOneContact = async (req, res, next) => {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (contact) {
        res.json(contact);
    }
    throw HttpError(404);
};

export const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    const deleteContact = await contactsService.removeContact(id);
    if (deleteContact) {
        res.json(deleteContact);
    }
    throw HttpError(404); 
};

export const createContact = async (req, res, next) => {

    const newContact = await contactsService.addContact(req.body);
    if (newContact) {
        res.json(newContact);
    }
    throw HttpError(400);
};

export const updateContact = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    
    if (Object.keys(data).length === 0) {
        res.json({ "message": "Body must have at least one field" });
    }

    const changeContact = await contactsService.updateContact(id, data);
    if (updateContact) {
        res.json(changeContact);
    }
};
