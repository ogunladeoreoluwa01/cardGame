const User = require("../models/user.model");
const Pet = require('../models/pet.model.js')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP =require("../models/otp.model")
const crypto =require("crypto")
const mailer = require("../utils/sendMailConfig");


const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  let code = '';

  // Generate random bytes (secure random number) and map them to characters
  for (let i = 0; i < codeLength; i++) {
    // Generate random byte (0 to 255)
    const randomByte = crypto.randomBytes(1)[0];
    
    // Map the random byte to a character from the defined set
    const characterIndex = randomByte % characters.length;
    code += characters.charAt(characterIndex);
  }

  return code;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getPetsId = (pets) => {
  // Extract IDs from the pets array
  const ids = pets.map(pet => pet.id);

  // Shuffle the IDs
  const shuffledIds = shuffleArray(ids);

  // Select the first 10 unique IDs
  const petsId = shuffledIds.slice(0, 10);

  return petsId;
};

const pets = [
 {
      "name": "Emberclaw",
      "id": "669a9128a063f66e717131a4"
    },
    {
      "name": "Flame Serpent",
      "id": "669a9128a063f66e717131a7"
    },
    {
      "name": "Inferno Guardian",
      "id": "669a9128a063f66e717131aa"
    },
    {
      "name": "Blaze Phoenix",
      "id": "669a9128a063f66e717131ad"
    },
    {
      "name": "Magma Titan",
      "id": "669a9128a063f66e717131b0"
    },
    {
      "name": "Fire Drake",
      "id": "669a9128a063f66e717131b3"
    },
    {
      "name": "Volcanic Behemoth",
      "id": "669a9128a063f66e717131b6"
    },
    {
      "name": "Lava Golem",
      "id": "669a9128a063f66e717131b9"
    },
    {
      "name": "Tide Guardian",
      "id": "669a9128a063f66e717131bc"
    },
    {
      "name": "Aqua Serpent",
      "id": "669a9128a063f66e717131bf"
    },
    {
      "name": "Coral Siren",
      "id": "669a9128a063f66e717131c2"
    },
    {
      "name": "Kraken",
      "id": "669a9128a063f66e717131c5"
    },
    {
      "name": "Leviathan",
      "id": "669a9128a063f66e717131c8"
    },
    {
      "name": "Tsunami Dragon",
      "id": "669a9129a063f66e717131cb"
    }
];

const generateJwt = (userId,expiresTime) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: expiresTime,
  });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const [userName, userEmail] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email }),
    ]);

    if (userName) {
      return res.status(400).json({
        message: "User with the username already exists. Try another username.",
      });
    }

    if (userEmail) {
      return res.status(400).json({
        message: "User with the email already exists. Try another email.",
      });
    }

    const coverImage = [
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752752/banners/krtd7r8c3rcnc3sf085y.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752762/banners/rumelxnrqxqw3xqfibjv.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752757/banners/bd4ljls4skpvdqukga1m.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752755/banners/gqwmj7n0vayf7nhjdxfk.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752754/banners/ty6hxccdvsaq5oxgpdc0.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752753/banners/mfryrl6ogrxqj9m5hr5s.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752753/banners/nzj31j3lpn9zf6d4emjr.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752753/banners/nzsyjkdabvrgetufgsjt.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752753/banners/jibp5rfg46cs0vgszyts.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752752/banners/avmn70pzbixfrwxk9ndn.jpg",
    ];

    const avatarImage = [
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752756/profiles/kftgxuglthk0bkzcwoxr.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752761/profiles/tkytmwlikk5opl0mdqsp.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752761/profiles/mj56mtoceqwmjp1ijtmj.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752761/profiles/yq2yafktjskh0pxiek2z.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752761/profiles/deyvxq1lbjjocmwxm7k8.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752759/profiles/twpnyrbumjssxcyvnwfl.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752758/profiles/y4zfictsmzfhsk9gpeu7.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752758/profiles/stkxrm0cfjh4kvjaoubg.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752757/profiles/cshxb5nllzlw0wcpcsog.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752757/profiles/jrkypeb7xxnn1dq6ovyv.jpg",
      "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752756/profiles/mobd90fwxwo533rmadmh.jpg",
    ];

    const randomCoverIndex = Math.floor(Math.random() * coverImage.length);
    const randomAvatarIndex = Math.floor(Math.random() * avatarImage.length);
    const randomCover = coverImage[randomCoverIndex];
    const randomAvatar = avatarImage[randomAvatarIndex];


    const newUser = new User({
      username,
      email,
      password: password,
      profile: {
        avatar: randomAvatar,
        coverImage: randomCover
      }
    });

    const user = await newUser.save();

    const createPetsForUser = async (userId,userName) => {
      const randomPets = getPetsId(pets);
      const petsData = [];
      for (const petId of randomPets) {
        const petData = new Pet({
          petInfo: petId,
          userProfile: {
            userId: userId,
            username:userName
          }
        });
        const userPet = await petData.save();
        petsData.push(userPet._id);
      }
      return petsData;
    };

    const userPets = await createPetsForUser(user._id,user.username);
    user.pets.allPets = userPets;
    user.pets.currentDeck = userPets;
    await user.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.oldPassword;
    delete userResponse.notifications;
    delete userResponse.__v;

    const accessToken = generateJwt(newUser._id, "15m");
    const refreshToken = generateJwt(newUser._id, "14d");
    res.status(201).json({
      message: "User registered successfully.",
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userInfo, password } = req.body;

    // Check if the provided credential matches a username or an email
    const user = await User.findOne({
      $or: [{ username: userInfo }, { email: userInfo }],
    }).select(
      "-notifications "
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with the provided credential does not exist." });
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(410).json({ message: "Incorrect password" });
    }

    // If password matches, generate JWT token
    const accessToken = generateJwt(user._id, "14d");
    const refreshToken = generateJwt(user._id, "14d");

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.oldPassword;
    delete userResponse.__v;
 

    // Respond with user data and token
    res.status(200).json({
      message: "User logged in successfully.",
      user: userResponse ,
     accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error during user login:", error); // Log the error details
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -oldPassword -notifications -__v");

    if (!user) {
      return res.status(441).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateJwt(user._id, "15m");
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);

    if (error.name === 'TokenExpiredError') {
      res.status(403).json({ message: "Refresh token expired" });
    } else {
      res.status(403).json({ message: "Invalid refresh token" });
    }
  }
};

const createOtpCode = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otpCode = generateRandomCode();
    console.log(otpCode);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User with the provided credential does not exist." });
    }

    const expiring = Date.now() + 3600000; // 1 hour in milliseconds

    const otp = new OTP({
      user: userId,
      otpCode: otpCode,
      expiringAt: new Date(expiring),
    });

    await otp.save();
    
    let email = user.email;
    let subject = `Verification Token for ${user.username}`;
    let text = `Your verification code is: ${otpCode}`;
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;


          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1, h2 {
          color: #333;
        }
        p {
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
       <h1>placeholder</h1>
        <h1>Your Verification Code</h1>
      <p>Dear ${user.username},</p>
      <p>Your verification code is <strong> ${otpCode} <strong/>. it will last one hour (1)!</p>
      <p>Best regards,</p>
      <p>placeholder</p>
      </div>
    </body>
    </html>
    `;

    await mailer(email, subject, text, html);

    res.status(200).json({
      message: "OTP sent to your email.",
    });
  } catch (error) {
    console.error("Error generating OTP code:", error);
    error.statusCode = 500;
    next(error);
  }
};




module.exports ={
    registerUser,
    loginUser,
    refreshToken,
    createOtpCode,
}