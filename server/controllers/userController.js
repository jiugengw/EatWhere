import User from './../models/userModel.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


import {modifyPreferences} from './../services/userService.js';
import fetchHistory from './../services/historyService.js';
import {fetchGroupByCode,fetchGroupsByUser} from './../services/groupService.js';

import generateDefaultPreferences from './../constants/defaultCuisines.js';
import catchAsync from './../utils/catchAsync.js';

export const createUser = catchAsync(async (req, res, next) => {
  const { name, password, preferences, avoid, group, history } = req.body;

  const hashpassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    password: hashpassword,
    preferences: preferences || generateDefaultPreferences(),
    avoid,
    group,
    history,
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
    token,
    status: 'success',
    data: {
      user: newUser,
    },
  });
});


export const getUser = catchAsync(async (req, res, next) => {
  const user = req.user;
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
    token,
    data: {
      user,
    },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  Object.assign(req.user, req.body);
  const user = await req.user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  await req.user.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getUserPreferences = catchAsync(async (req, res, next) => {
  const preferences = req.user.preferences;

  res.status(200).json({
    status: 'success',
    data: {
      preferences,
    },
  });
});

// for both creating and updating
export const updateUserPreferences = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { preferences } = req.body;

  const updatedPrefs = modifyPreferences(user, preferences);
  res.status(200).json({
    status: 'success',
    data: {
      preferences: updatedPrefs,
    },
  });
});

export const getUserHistory = catchAsync(async (req, res, next) => {
  const userHistory = fetchHistory('user', req.user._id, req.query);

  res.status(200).json({
    status: 'success',
    data: {
      history: userHistory,
    },
  });
});

export const getUserGroups = catchAsync(async (req, res, next) => {
  const userGroups = fetchGroupsByUser(req.user._id, req.query);

  res.status(200).json({
    status: 'success',
    data: {
      groups: userGroups,
    },
  });
});


//controllers below for testing (temporarily here)

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