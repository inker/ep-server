module.exports = () => (req, res, next) => {
  console.log(new Date(), req.body)
  next()
}
