import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
}, {
  timestamps: true
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {  //we want to run this before save
  if (!this.isModified('password')) { // a mongoose method that helps us check if password is modified or not
    next()
  }
  //if user wants to modify password in update profile:
  const salt = await bcrypt.genSalt(10) //we need this 'salt' to hash the password asynchronously
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)
export default User

// helpful concepts:

/*
Q. For example, let's say we have a hash
@hash_secret_value@ we can check if this value equals my password 123456
But why we can't do the reverse?
If 123456 equals @hash_secret_value@
How does it work?
Why every generation of hash creates a new value?

A. The algorithms used are one-way, which is why we cannot retrieve the original string from the hash.
We produce a unique hash which is dependent on our original password string. Then, when we enter our
password for authentication, the program creates a hash from the string we provide and compares it to
the stored one.
Here is a link to an oversimplified example: https://computer.howstuffworks.com/encryption5.htm

The hashing algorithm is provided by bcryptjs, read more about password hashing here if you want:
https://auth0.com/blog/hashing-passwords-one-way-road-to-security/
https://www.wired.com/2016/06/hacker-lexicon-password-hashing/

After storing encrypted passwords with bcrypt.hash(password, salt);   
and comparing them on login with bcrypt.compare(password, user.password); , 
we store the user id in a token which uses our jwtSecret in order to be verified, as an extra level of 
protection.
So in total you can think of it as a three steps procedure.

1. Using passwords to authenticate.
2. Storing encrypted passwords so that even if they are intercepted they are useless to the interceptor
(because of the one-way hashing algorithm).
3. Authenticating with a token that requires a secret to be verified.

*/