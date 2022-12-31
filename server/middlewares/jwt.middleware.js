import jwt from 'jsonwebtoken';
import config from "../../config/config";

const verifyJWT = (req, res, next) => {
    console.log(req.path);
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        config.jwtSecret,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            // console.log(decoded.user.username);
            req.user = decoded.user.username
            next()
        }
    )
}

export default verifyJWT;