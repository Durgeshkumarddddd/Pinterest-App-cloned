var express = require('express');
var router = express.Router();
var userModel = require('./users')
const postModel = require('./post')
const upload = require('./multer')
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{ nav : false });
});
router.get('/register', function(req, res, next){
  res.render('register',{ nav : false });
});
router.get('/profile', isLoggedIn , async function(req, res, next){
     // find user using username and send user
     const user = await userModel
     .findOne({username : req.session.passport.user}) // find user which is logged in
     .populate("posts")
     console.log(user);
     res.render('profile',{user,nav:true}); // send data base means user data, Now do some changes in profile.ejs where img print
});
router.post('/register' , function(req, res){
 const { username, email, contact } = req.body;
 const userdata = new userModel({ username, email, contact });

  userModel.register(userdata, req.body.password)
  .then(function(){
  passport.authenticate("local")(req, res, function(){
  res.redirect('/profile')
    });
 })
 })
router.post('/login', passport.authenticate("local" , {
successRedirect : '/profile' ,
failureRedirect : '/'
}) , function(req , res, next){
});
router.get('/logout' , function(req, res, next){  // it is in file or search passport req.logout
  req.logout(function(err){
    if(err){ return next(err);}
    res.redirect('/');
  });
});
// isLoggedIn Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
}
// just select and upload file
router.post('/fileupload', isLoggedIn, upload.single("image"), async function(req, res, next){
  const user = await userModel.findOne({username : req.session.passport.user}) // using username find the user
  image = req.file.filename    // filename enter in profileImage  of user
  await user.save()                       // save filename in user profileImage
  res.redirect('/profile')               // after that which image you save in profile.ejs replace and create dynamic save
})                                      // Go on profile route and find and show profile image
router.get('/add', isLoggedIn , async function(req,res, next){
  const user = await userModel.findOne({username : req.session.passport.user})
 res.render('add', {user , nav : false });
});
router.post('/createpost', isLoggedIn ,upload.single("postimage"), async function(req,res, next){
  const user = await userModel.findOne({username : req.session.passport.user})
  const post = await postModel.create({
    user : user._id ,
    title : req.body.title,
    description : req.body.description ,
    image : req.file.filename ,
  });
  user.posts.push(post._id);
  await user.save() ;
 res.redirect('/profile')
});
module.exports = router
 

