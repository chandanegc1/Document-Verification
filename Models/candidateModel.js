import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type:String,
    required:true,
    unique:true
  },
  password: String,
  employeeId: {
    type: String,
  },
  location: {
    type: String,
    default: 'my city',
  },
  companyName: {
    type: String,
  },
  role: {
    type: String,
    enum: ['candidate','hr', 'admin'],
    default: 'candidate',
  },
  avatar:String,
  avatarPublicId:String,
  status: {
    type: Boolean,
    default: false,
  },
});

// remove password (select)
UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};


export default mongoose.model('Candidate', UserSchema);