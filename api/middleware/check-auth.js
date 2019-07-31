const jwt = require('jsonwebtoken');

//practice used in express apps to define custim middlewares
module.exports = (req, res, next)=> {
  if (req.headers.authorization.split(" ")[0] === "Bearer"){
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
  next();
} else {
  res.status(401).json({
    message: 'Auth failed'
  });
  next();
}
};
