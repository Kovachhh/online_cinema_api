import * as mongoose from 'mongoose';

import { ADMIN_TYPE, MEMBER_TYPE } from '../../utils/enum.constants';

export const UserSchema = new mongoose.Schema({
     email: { type: String, required: true, uniq: true },
     username: { type: String, required: true, uniq: true },
     password: { type: String, required: true, },
     type: { type: String, enum: [ ADMIN_TYPE, MEMBER_TYPE ] },
});

// UserSchema.pre('save', function(next){

//      let user = this;
 
//      // Make sure not to rehash the password if it is already hashed
//      if(!user.isModified('password')) return next();
 
//      // Generate a salt and use it to hash the user's password
//      bcrypt.genSalt(10, (err, salt) => {
 
//          if(err) return next(err);
 
//          bcrypt.hash(user.password, salt, (err, hash) => {
 
//              if(err) return next(err);
//              user.password = hash;
//              next();
 
//          });
 
//      });
 
//  }); 
 
//  UserSchema.methods.checkPassword = function(attempt, callback){
 
//      let user = this;
 
//      bcrypt.compare(attempt, user.password, (err, isMatch) => {
//          if(err) return callback(err);
//          callback(null, isMatch);
//      });
 
//  };