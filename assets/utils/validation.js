import validatejs from "validate.js";

export const validationDictionary = {
  bool: {
    presence: {
      allowEmpty: false,
      message: "^This is required",
    },
  },

  day: {
    presence: {
      allowEmpty: false,
      message: "^This is required",
    },
    numericality: {
      greaterThan: 0,
      lessThanOrEqualTo: 31,
      message: "^Must be valid",
    },
  },

  email: {
    presence: {
      allowEmpty: false,
      message: "^This is required",
    },
    email: {
      message: "^Email address must be valid",
    },
  },

  password: {
    presence: true,
    length: {
      minimum: 6,
      message: "^Your password must be at least 6 characters",
    },
  },

  name: {
    presence: {
      allowEmpty: false,
      message: "^This is required",
    },
    length: {
      minimum: 2,
      message: "^Enter something longer",
    },
  },
};

export default function validateInput({ type, value }) {
  const result = validatejs(
    {
      [type]: value,
    },
    {
      [type]: validationDictionary[type],
    }
  );

  if (result) {
    return result[type][0];
  }

  return null;
}
