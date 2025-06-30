"use strict";
// import { Schema, model } from 'mongoose';
// const historySchema = new Schema(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     group: {
//       type: Schema.Types.ObjectId,
//       ref: 'Group',
//       default: null,
//     },
//     restaurant: {
//       type: new Schema({
//         placeId: {
//           type: String,
//           required: true,
//         },
//         name: {
//           type: String,
//           required: true,
//         },
//         cuisine: {
//           type: String,
//           required: true,
//         },
//       }),
//       required: true,
//     },
//     userOpinion: {
//       type: new Schema({
//         rating: {
//           type: Number,
//           required: true,
//           min: 1,
//           max: 10,
//         },
//         notes: {
//           type: String,
//           required: true,
//           trim: true,
//           minlength: 5,
//           maxlength: 200,
//         },
//       }),
//       required: true,
//     },
//     date: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   }
// );
// export default model('History', historySchema);
