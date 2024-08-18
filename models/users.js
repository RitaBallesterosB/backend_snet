import { Schema, model } from "mongoose";

const UserSchema = Schema ( {
    name: {
        type: String,
        requiered: true
    },
    last_name: {
        type: String,
        requiered: true
    },
    nick: {
        type: String,
        requiered: true,
        unique: true
    },
    email: {
        type: String,
        requiered: true,
        unique: true
    },
    bio: String,
    password: {
        type: String,
        requiered: true
    },
    role: {
        type: String,
        default: "role_user"
        
    },
    image:{
        type: String,
        default: "default.png"
    },
    created_at: {
        type: Date,
        default: Date.now

    }
});

export default model("User", UserSchema, "users");
//"User" nombre del modelo
// UserSchema nombre del esquema
// "users nombre de la colección en MongoDB"