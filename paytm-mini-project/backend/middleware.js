import JWT_SECRET from "./config.js";
import jwt from "jsonwebtoken";

const authmiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json('Bad Request from authorization');
    }
    
    //extracting token from headers
    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);

        if(decodedToken){
            req.userId = decodedToken.userId;
            next();
        }
    }
    catch (err) {
        return res.status(403).json('Invalid token');
    }
}

export default authmiddleware;