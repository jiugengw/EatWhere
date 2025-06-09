import User from './../models/userModel.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const createUser = async (req, res) => {
  try {
    const {name,password,preferences,avoid,group,history} = req.body;
    const hashpassword = await bcrypt.hash
    (password,10);
    
    const newUser = await User.create({
      name,
      password:hashpassword,
      preferences,
      avoid,
      group,
      history
  });
  const token = jwt.sign(
      {name:newUser.name,
        userId:newUser._id,
        preferences: newUser.preferences
      },
      process.env.JWT_TOKEN,
      {expiresIn:'1h'}
    )
    
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};


export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user){
      return res.status(404).json({
        status:"fail",
        message:'user not found'
      })
    }
    const token = jwt.sign(
      {name:user.name,
        userid:user._id,
        preferences:user.preferences
      },
      process.env.JWT_TOKEN,
      {expiresIn:'1h'}
    )
    res.status(200).json({
      status: 'success',
      data: {
        user,
        token
      },
    });
  } catch (err) {
    if (err.name === 'CastError'){
      return res.status(404).json({
        status:"fail",
        message:'user not found'
      })
    }
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
      message:"successfully deleted user"
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//controllers below for testing

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    
    res.status(200).json({ status: 'success', data: users });

  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

export const generateToken = async(req,res)=>{
  try{
    const token = jwt.sign({
      name:'test'
    },process.env.JWT_TOKEN,
  {expiresIn:'1h'})
  res.status(201).json({
    status:'success',
    message:'add the following below as key:value for header on postman',
    Authorization:`Bearer: ${token}`})
  }catch(err){
    res.status(400).json({status:'fail',message:err})
  }
}