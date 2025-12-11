import mongoose from "mongoose";

const {Schema, model} = mongoose;
const PostSchema = new Schema({
    title:{type:String, required: true, min:50},
    summary:{type:String, required: true, },
    content:{type:String, required: true, },
    cover:{type:String, required: true, },
    auther:{type:Schema.Types.ObjectId, ref:"User", required: true, },
},
{ timestamps: true } 
)

const PostModel = model("Post", PostSchema);

export default PostModel;