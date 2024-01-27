import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
    try {
    const allContacts = await contactsService.listContacts();
    res.json(allContacts);
    } catch (error) {
        next(error)
    }
};

export const getOneContact = async (req, res, next) => {
    try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (!contact) {
        throw HttpError(404);
    }
    res.json(contact);
    } catch (error) {
        next(error)
    }
};

export const deleteContact = async (req, res, next) => {
    try {
    const { id } = req.params;
    const deleteContact = await contactsService.removeContact(id);
    if (!deleteContact) {
        throw HttpError(404); 
    }
    res.json(deleteContact);
    } catch (error) {
        next(error) 
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        const newContact = await contactsService.addContact(name, email, phone);
        if (newContact) {
            res.status(201).json(newContact);
        }
        throw HttpError(400, error.message);
    } catch (error) {
        next(error)
    }
}

export const updateContact = async (req, res, next) => {
    try {
    const { id } = req.params;
    const data = req.body;
    
    if (Object.keys(data).length === 0) {
        res.status(400).json({ "message": "Body must have at least one field" });
    }

    const changeContact = await contactsService.updateContact(id, data);
    if (changeContact) {
        res.status(200).json(changeContact);
        }else {
            throw HttpError(404, "Not found");
        }
    } catch (error) {
        next(error)
    }
};
    