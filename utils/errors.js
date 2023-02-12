const handleErrors = (error) => {
  if (error?.name === "CastError" && error.path === "_id")
    return "Id Not found";
};

module.exports = handleErrors;
