const mongoose=require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastname:{
        type:String
    },
    age:{
        type: Number,
        min: 14,
        max: 70,
     
    },
    gender:{
        type: String,
        // enum: ["male","female","others"]
        validate(value){
            if(!["male","female","others"].includes(value))
                throw new Error("Invalid Gender")
        }
    },
  problemsolved: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: "problem",
  default: []
}
,
    emailId:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase:true,
        immutable: true,
    },
    password:{
        type: String,
        required:true,
    },
    photo:{
        type: String,
        default: "This is the default photo"
    },
role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
}


}, { timestamps: true })


const User = mongoose.model("user",userSchema);

module.exports = User;