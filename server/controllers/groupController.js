import Group from './../models/groupModel.js';

export const createGroup = async (req, res) => {
  try {
    const newGroup = await Group.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        group: newGroup,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

export const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        group,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        group,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
