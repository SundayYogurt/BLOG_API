import mongoose from "mongoose";

const {Schema, model} = mongoose;
const UserSchema = new Schema({
    username:{type:String, required: true, unique: true, min:4},
    password:{type:String, required: true, min: 6},
})

const UserModel = model("User", UserSchema);

export default UserModel;