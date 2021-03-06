const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Lütfen isminizi giriniz."],
    trim: true,
  },
  surname: {
    type: String,
    required: [true, "Lütfen soyadınızı giriniz."],
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Lütfen bir şifre giriniz."],
    minlength: [7, "Şifre en az 7 karakterden oluşmalı."],
    validate(value) {
      if (value.includes("gusto")) {
        throw new Error("Şifre içinde gusto kullanamazsınız.");
      }
    },
  },
  date: {
    type: Date,
    default: new Date(),
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function (userAgent) {
  const user = this;

  const token = jwt.sign(
    { _id: user._id.toString(), username: user.username, userAgent },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: 3 * 24 * 60 * 60,
    }
  );
  user.tokens = user.tokens.concat({ token });

  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async function (username, password) {
  const user = await Users.findOne({ username });

  if (!user) {
    throw new Error("Kullanıcı Bulunamadı!");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Kullanıcı Adı veya şifre hatalı!");
  }

  return user;
};

//This function works before save the db
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  return user;
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
