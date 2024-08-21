import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.log("No token detected");
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedData?.id;
        next();
    } catch (error) {
        console.error('Middleware error: ' + error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Unauthorized: Token has expired" });
        }

        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

export default auth;
