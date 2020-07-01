const GoogleStrategy = require('passport-google-oauth20').Strategy

const mongoose = require('mongoose')

//bring usermodal here

const User = require('../models/User')

module.exports = function (passport) { //this passport argument we are passing from app.js line number 13
    passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:'/auth/google/callback'
    },
    async (accessToken,refreshToken,profile,done)=>{ //this is callback function if the user succeed as it is mongodb for database so we use async
        const newUser = {
            googleId:profile.id,
            displayName:profile.displayName,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
            image:profile.photos[0].value
        }
        
        try {
            let user = await User.findOne({googleId:profile.id}) //check if the user find in mongodb database
            if(user){
                done(null,user) //here first parameter is for error
            }
            else{
                user = await User.create(newUser) //if usre not found we will create new user object in mongodb
                done(null,user)
            }
        }
        catch(err) {
            console.log(err)
        }
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}