const User = require('../models/userModel');
const bcrypt = require('bcrypt');


exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("req.body", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }
    console.log("existingUser",existingUser);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword",hashedPassword);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
    } 
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server Error' });
  }
};


exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email) {
      const user = await User.findOne({ email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const userObject = user.toObject();
          delete userObject.password;
          res.status(200).json(userObject);
        } else {
          res.status(401).json({ error: 'Invalid password' });
        }
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } else {
      res.status(400).json({ error: 'Please enter an email address' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteUser = async (req, res) =>{
  try {
    const userId = req.params.id;
    //console.log(userId);
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } 
  catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.updateUser = async (req, res)  => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password },
      { new: true }
    );
    
    if (updatedUser) {
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } 
  catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};