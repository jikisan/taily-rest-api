const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const response = {
    message: err.message || 'Internal Server Error'
  };
  if (err.details) response.details = err.details;
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }
  res.status(status).json(response);
};

module.exports = errorHandler;
