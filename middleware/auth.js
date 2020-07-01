//middleware is just the function that can access the request and response object
module.exports = {
    ensureAuth : (req,res,next) => {
        if(req.isAuthenticated()){
            return next()

        }
        else{
            res.redirect('/') //if not authenticated will redirect to home page 
        }
    },
    ensureGuest : (req,res,next) =>{
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        }
        else{
            return next()
        }
    }
}