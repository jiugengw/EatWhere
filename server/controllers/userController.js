import User from './../models/userModel.js';
import catchAsync from './../utils/catchAsync.js';

export const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: 'success',
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

// export const updateUserPassword = async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;

//     if (!oldPassword) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Old password is required.',
//       });
//     } else if (!newPassword) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'New password is required.',
//       });
//     }

//     const user = await User.findById(req.params.id);

//     if (user.password !== oldPassword) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'Old password is incorrect',
//       });
//     }

//     user.password = newPassword;
//     await user.save();

//     res.status(200).json({
//       status: 'success',
//       message: 'Password updated successfully',
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

// export const updateUserPreferences = async (req, res) {
//     try {
//         const user = await User.findById(req.params.id);

//     }
// }
