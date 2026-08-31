const jwt = require('jsonwebtoken');


function protect(req, res, next){

    const {authorization} = req.headers;


    if(!authorization || !authorization.startsWith('Bearer')){ //validate token
        return res.status(401).json({message: "Access Denied"});
    }

    const token = authorization.split(" ")[1];

    jwt.verify( // verify validated token
        token,
        process.env.JWT_SECRET,
        function(err, decoded){
            if(err){ return res.status(401).json({message: "Invalid bearer token"});}

            req.user = decoded;
            next();
        }

     );
}

module.exports = protect;