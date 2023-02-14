const handleErrors = (error) => {
  if (error?.name === "CastError" && error.path === "_id")
    return "Id Not found";

  return error.message;
};

module.exports = handleErrors;
