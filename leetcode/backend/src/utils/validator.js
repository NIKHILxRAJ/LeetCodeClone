const validator=require('validator')
const validate=(data)=>{
const mandatoryfield=['firstName','emailId','password'];
const isallowed=mandatoryfield.every((k)=>Object.keys(data).includes(k));
if(!isallowed){
    throw new Error("some field is missing");
}
if(!validator.isEmail(data.emailId)){
    throw new Error('invalid email');
}
if(!validator.isStrongPassword(data.password)){
    throw new Error('weak password');
}
 
 
}
module.exports=validate;