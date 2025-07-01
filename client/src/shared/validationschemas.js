export const loginValidation = {
  usernameOrEmail: {
    required: "This field is required",
  },
  password: {
    required: "Password is required",
  },
};

export const signupValidation = {
  firstName: {
    required: "first name is required",
  },
  lastName: {
    required: "last name is required",
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
      message: "Invalid email address",
    },
  },
  username: {
    required: "Username is required",
    minLength: {
      value: 3,
      message: "Minimum 3 characters",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Minimum 8 characters",
    },
  },
};
