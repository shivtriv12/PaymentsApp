import mongoose,{Document,Schema,model} from "mongoose";
import dotenv from "dotenv";

dotenv.config();
async function dbConnect(){
    await mongoose.connect(process.env.MONGO_DB_URL||"");
}
dbConnect();

export interface User extends Document{
    username:string,
    password:string,
    firstname:string,
    lastname:string
}
const UserSchema:Schema<User> = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    firstname:{
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    }
});
export const userModel = model("User",UserSchema);

const AccountSchema = new Schema({
    balance:{
        type:Number,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
});
export const accountModel = model("Account",AccountSchema);