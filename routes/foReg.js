const express = require('express');
const router = express.Router();
const FoReg = require('../models/FoReg');
const UserCredential =require('../models/UserCredential');



router.get('/aoDashboard', async (req, res) => {
    if (req.session.user) {
        try {

            let auser = await UserCredential.find();
            console.log(auser)
            if (req.query.email) {
                auser = await UserCredential.find({ email: req.query.email })
            }
            res.render('aoDashboard', { users: auser, currentUser: req.session.user })
            
        } catch (err) {
            res.status(400).send('Unable to find Dashboard')
        }
    } else {
        console.log("Cant find Session")   
    res.redirect('/logIn')    
    }         
})

//specify what to be done when user hits end point

router.get('/foRegData', (req, res) => {
      if (res.session.user) {
    res.render('foReg'//, { title: 'Reg form' }
        );
      } else {
       
       console.log("Cant find session")
         req.redirect('logIn')
      }
});
 
router.post('/foRegData', async (req, res) => {
 
    // Validation.......
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('role','Role is required').notEmpty();
 
    var errors =  req.validationErrors();
 
 // check fields for validation errors
    if(errors) {

       // return errors......
        req.flash("error", errors);
        res.redirect('foRegData')

              //OR......

         // req.flash("error", "Please fill all the required fields!");
         //res.redirect('foRegData')

 
    } else {
          
     if (res.session.user) {
        try {
            
            const foreg = new FoReg(req.body);
        
            await FoReg.register(foreg, req.body.password, (err) => {
                if (err) {
                    throw err
                }
                //FOR A SUCCESS....

               // req.flash("success", "You have succeded!");
               res.redirect('foRegData')

                           //OR..

            // req.flash("success", "You have succeded!");
             // res.render('foReg', { successes: req.flash("success") });

               
            })
            } catch (err) {
                res.status(400).send('Sorry! Something went wrong.')
                console.log(err)
            }

        } else {
            
                console.log("Cant find session")
                res.redirect('logIn')
            }
    }

   
});
 // retrieve data from the database 
router.get('/foList', async (req, res) => {
    if (req.session.user) {
        try {
            let puser = await FoReg.find()
            if (req.query.nin) {
                puser = await FoReg.find({ nin: req.query.nin })
            }
            res.render('foList', { title: 'fo list', users: puser, currentUser:req.session.user})
        } catch (err) {
            res.status(400).send("Unable to find items in the database");
        }
    }else {
        console.log("Can't find session")
        res.redirect('/logIn')
    }
})


    //Gives access to retrieve data in the db
// router.get('/foList', async (req, res) => {
//     if(res.session.user){
//         try {

//             let auser = await FoReg.find()
//             console.log(auser)
//             res.render('foList',{users: auser})
            
//         }catch(err){
//              res.status(400).send('Unable to find items in database')
//         }
//     } else {
//         console.log("Cant find session")
//         req.redirect('logIn')
//     }
  
// })

router.get('/update/:id', async (req, res) => {
    if(res.session.user){
        try {
            const updateUser = await FoReg.findOne({ _id: req.params.id })
            res.render('updatefo', { user: updateUser })
        } catch (err) {
            res.status(400).send("Unable to find item in the database");
        } 
    } else {
        console.log("Cant find session")
        req.redirect('logIn')
    }
  
})

router.post('/update', async (req, res) => { 
    try {
      await FoReg.findOneAndUpdate({ _id:req.params.id }, req.body)
        res.redirect('foList')
    } catch (err) {
        res.status(400).send("Unable to update items in the database");
    }  
})
   

router.get('/foDashboard', async (req, res) => {
        if (req.session.user) {
            try {
    
                let auser = await FoReg.find();
                console.log(auser)
                if (req.query.gender) {
                    auser = await FoReg.find({ gender: req.query.gender })
                }
                res.render('foDashboard', { users: auser, currentUser: req.session.user })
                
            } catch (err) {
                res.status(400).send('Unable to find Dashboard')
            }
        } else {
            console.log("Cant find Session")   
        res.redirect('/logIn')    
        }         
    })
    
    



module.exports = router;