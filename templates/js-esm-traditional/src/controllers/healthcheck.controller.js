export const getHealth = (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
};
