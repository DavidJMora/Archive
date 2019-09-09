const Todo = require('../model/Todo');
const User = require('../../users/model/User');

module.exports = {
    findTodoByCategory: (completed) => {
        return new Promise((resolve, reject) => {

            Todo.find({completed: completed})
                .then( found => {
                    resolve(found)
                })
                .catch( error => {
                    reject(error)
                })

        })
    },

    completeTodoByID: (id, bool) => {

        return new Promise((resolve, reject) => {

            Todo.findByIdAndUpdate(id, { completed: bool }, {new: true})
                .then( updatedTodo => {
                    resolve(updatedTodo)
                })
                .catch( error => {
                    reject(error)
                })

        })
    },

    getAllTodos: (id) => {

        return new Promise((resolve, reject) => {

            User.findById({_id: id}, 'todos email username')
                .populate('todos', '-user_id -__v')
                .exec((err, user) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(user)
                    }

                });

        });
    },
    createTodo: (params) => {

        return new Promise((resolve, reject) => {

            
            User.findById(params.id)
                .then(user => {

                    let newTodo = new Todo({
                        todo: params.todo.newTodo,
                        user_id: user.id
                    });

                    newTodo
                        .save()
                        .then( savedTodo => {

                            user.todos.push(savedTodo);

                            user.save()
                                .then( () => {
                                    resolve(savedTodo);
                                })
                                .catch(error => {
                                    reject(error);
                                })

                        })
                        .catch(error => {
                            reject(error);
                        })

                })
                .catch( error => {
                    reject(error);
                })



        });


    },

    updateTodoByID: (id, newTodo) => {

        return new Promise((resolve, reject) => {

            Todo.findByIdAndUpdate(id, { todo:newTodo }, { new: true })
                .then( newTodo => {
                    resolve(newTodo);
                })
                .catch( error => {
                    reject(error);
                })



        });
    },


    deleteTodoByID: (userID ,id) => {


        return new Promise((resolve, reject) => {

            User.findById(userID)
                .then( user => {

                    let filteredArray = user.todos.filter( e => e.toString() !== id);

                    user.todos = filteredArray;

                    user.save()
                        .then( user => {

                            Todo.findByIdAndDelete(id)
                                .then( deleted => {

                                    
                                    User.findById({_id: userID}, 'todos')
                                        .populate('todos', '-user_id -__v')
                                        .exec((err, user) => {
                                            if (err) {
                                                reject(err)
                                            } else {
                                                resolve(user);
                                            }
                                        })



                                })
                                .catch( error => {
                                    reject(error);
                                })


                        })
                        .catch( error => {
                            reject(error);
                        })
                    
                })
                .catch( error => {
                    reject(error);
                })


      



        });

    }


}