const isAuthenticated = (req,res, next) => {
    const user = req.session.user;
    if(!user || (!user.displayName && !user.username)){
        return res.status(401).json('You do not have access.')
    }
    next();
};

module.exports = {
    isAuthenticated
}
