import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contacts.js"

export const getAllContacts = async (req, res, next) => {
    try {
    const allContacts = await Contact.find();
        res.json(allContacts);
        console.log("successful");
    } catch (error) {
        next(error)
}
};

export const getOneContact = async (req, res, next) => {
    try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
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
    const deleteContact = await Contact.findByIdAndDelete(id);
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
        const newContact = await Contact.create(name, email, phone);
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

    const changeContact = await Contact.findByIdAndUpdate(id, data);
    if (changeContact) {
        res.status(200).json(changeContact);
        }else {
            throw HttpError(404, "Not found");
        }
    } catch (error) {
        next(error)
    }
};
    
export const updateStatusContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const favoriteContact = await Contact.findByIdAndUpdate(id, data, { new: true });

    if (favoriteContact) {
        res.status(200).json(favoriteContact);
        }else {
            throw HttpError(404, "Not found");
        }
    } catch (error) {
        next(error)
    }
}



