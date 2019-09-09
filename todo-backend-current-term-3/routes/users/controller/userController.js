const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {

    signupAndLogIn: (params) => {
      
        return new Promise((resolve, reject) => {

            User.findOne({email: params.email})
                .then(user => {
       
                    if (user) {
                   
                      bcrypt.compare(params.password, user.password)
                      .then( isMatch => {
           
                        if (isMatch) {

                            
                            const payload = {
                                id: user._id, 
                                email: user.email,
                                username: user.username
                            }

                            jwt.sign(payload, process.env.SECRET_KEY, {
                                expiresIn: 3600
                            }, (err, token) => {

                                if (err) {
                                    reject(err)
                                } else {
                                    let success = {};
                                    success.confirmation = true; 
                                    success.token = `Bearer ${token}`;
                                    resolve(success);
                                }

                            });
                        } else {
                            let errors = {};
                            errors.message = 'username not found or check your password!';
                            errors.status = 400; 
                            reject(errors);
                        }

                      })
                      .catch( error => {
                        reject(error);
                      })


                    } else {
                       
                        const newUser = new User({
                                                    email: params.email,
                                                    username: params.username, 
                                                    password: params.password 
                                                });
                                           
                        bcrypt.genSalt(10, (err, salt) => {

                            bcrypt.hash(newUser.password, salt, (err, hash) => {

                                if (err) {
                                    reject(err);
                                } else {
                                    newUser.password = hash;

                                    newUser.save()
                                           .then( user => {

                                            const payload = {
                                                id: user._id, 
                                                email: user.email,
                                                username: user.username
                                            }

                                            jwt.sign(payload, process.env.SECRET_KEY, {
                                                expiresIn: 3600
                                            }, (err, token) => {

                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    let success = {};
                                                    success.confirmation = true; 
                                                    success.token = `Bearer ${token}`;
                                                    resolve(success);
                                                }

                                            })

                                           })
                                           .catch( error => {
                                               reject(error);
                                           })
                                    
                                }

                            })

                        });

                    }
                })
                .catch( error => {
                    reject(error);
                })


        });
    },
    login: (params) => {

        const email = params.email;
        const password = params.password;

        return new Promise((resolve, reject) => {

            User.findOne({ email })
                .then(user => {

                    if (!user) {
                        let errors = {};
                        errors.email = 'User not found! Please sign up';
                        errors.status = 400;
                        reject(erros)
                    } else {

                        bcrypt.compare(password, user.password)
                              .then( isMatch => {

                                if (isMatch) {
                                    const payload = {
                                        id: user._id, 
                                        email: user.email,
                                        username: user.username
                                    }
    
                                    jwt.sign(payload, process.env.SECRET_KEY, {
                                        expiresIn: 3600
                                    }, (err, token) => {
    
                                        if (err) {
                                            reject(err)
                                        } else {
                                            let success = {};
                                            success.confirmation = true; 
                                            success.token = `Bearer ${token}`;
                                            resolve(success);
                                        }
    
                                    });
                                } else {
                                    let errors = {};
                                    errors.message = 'username not found or check your password!';
                                    errors.status = 400; 
                                    reject(errors);
                                }

                                

                              })
                              .catch( error => {
                                reject(error);
                              })
                    }

                })
                .catch( error => {
                    reject(error)
                })


        });

    }
}