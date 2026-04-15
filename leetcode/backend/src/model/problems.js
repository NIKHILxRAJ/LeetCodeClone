const mongoose=require('mongoose');
const { Schema } = mongoose;
const problemschema=new Schema({
    title:{
        type:String,
        required:true,},
        tags:{
            type:String,
            enum:['array','linkedlist','dp','graph'],
           
        },
        description:{
                  type:String,
            required:true
        },
        visibletestcases:[{
             input:{
                type:String,
                required:true
             },
              output:{
                type:String,
                required:true
             },
              explanation:{
                type:String,
              
             }
        }],
             hiddentestcases:[{
             input:{
                type:String,
                required:true
             },
              output:{
                type:String,
                required:true
             }}],
              startcode:[{
             language:{
                type:String,
                required:true
             },
              initialcode:{
                type:String,
                required:true
             } }],
                referencesolution:[{
             language:{
                type:String,
                required:true
             },
              completecode:{
                type:String,
                required:true
             } }],
 problemsolved: [{
  type: Schema.Types.ObjectId,
  ref: "user"
}]

})
module.exports = mongoose.model('problem', problemschema);