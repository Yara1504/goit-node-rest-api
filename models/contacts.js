import { model, Schema } from 'mongoose';
import { HandleMongooseError } from "../helpers/HandleMongooseError.js";
import Joi from "joi";

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }
}, { versionKey: false, timestamps: true });


contactSchema.post("save", HandleMongooseError);
export const Contact = model('contact', contactSchema);

