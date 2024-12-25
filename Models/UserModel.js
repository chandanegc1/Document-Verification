import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  employeeId: {
    type: String,
  },
  location: {
    type: String,
    default: 'my city',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
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


export default mongoose.model('User', UserSchema);