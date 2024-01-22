import { nanoid } from "nanoid";
import fs from "fs/promises";
import path from "path";

const contactsPath = path.join('db', 'contacts.json')

async function listContacts() {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
}


async function getContactById(contactId) {
    const contacts = await listContacts();
    const contact = contacts.find((c) => c.id === contactId);
    return contact || null;
}

async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex((c) => c.id === contactId);
    if (index === -1) {
      return null;
    }
    const [deleteContact] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null));
  return deleteContact;
};

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone
  }
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null));
  return newContact;
}

async function updateContact(contactId, data) {
    const contacts = await listContacts();
    const index = contacts.findIndex((c) => c.id === contactId);
    if (index === -1) {
      return null;
    }
  contacts[index] = {
    ...contacts[index],
    ...data,
    };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null));
  return contacts[index];
};

const contacts = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

export default contacts;