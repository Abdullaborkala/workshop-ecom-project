export const notFound = (req, res) => {
  res.status(404).json({ message: `Not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({ message: err.message });
};
