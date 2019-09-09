import { Axios } from './Axios';
import jwt_decode from 'jwt-decode';
import setAuthJWT from './setAuthJWT';

export const apiHandleAddNewTodoList = (newTask, oldStateArray) => {
    return new Promise((resolve, reject) => {

        let token = localStorage.getItem('jwtToken');
        let decoded = jwt_decode(token);

        let newObj = {
            todo: newTask,
            id: decoded.id
          }

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        }

        Axios.post('/todo/createtodo', newObj, axiosConfig)
             .then( newTodo => {

                resolve(newTodo.data);

             })
             .catch( error => {
                reject(error)
             })


    });
}



export const handleGetAllTodos = () => {

    return new Promise((resolve, reject) => {

        let token = localStorage.getItem('jwtToken');
        let decoded = jwt_decode(token);

        Axios.get(`/todo?id=${decoded.id}`)
             .then( result => {
                resolve(result);
             })
             .catch( error => {
                reject(error);
             });
    });
}

export const handleSignUpAndLogInApi = (userInfo) => {

    return new Promise((resolve, reject) => {

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': "*"
            }
        };

        Axios.post('/users/signupandlogin', userInfo, axiosConfig)
             .then( result => {

                const { token } = result.data;

                localStorage.setItem('jwtToken', token);

                const decoded = jwt_decode(token);

                setAuthJWT(token);

                resolve(decoded);

             })
             .catch( error => {
                 reject(error.response.data.message);
             })
    

    });
}

export const apiAuth = () => {

    return new Promise((resolve, reject) => {

        let token = localStorage.getItem('jwtToken');
        let currentTime = Date.now() / 1000;
        let decoded = jwt_decode(token);

        if (decoded.exp < currentTime) {
            localStorage.removeItem('jwtToken');
            setAuthJWT(null);
            reject(null);
        } else {
            setAuthJWT(token);

            let user = {
                id: decoded.id,
                email: decoded.email, 
                username: decoded.username
            }

            resolve(user);
        }
    });
}

export const apiHandleDeleteByID = (todoID) => {

    return new Promise( (resolve, reject) => {

        let token = localStorage.getItem('jwtToken');
        let decoded = jwt_decode(token);

        Axios.delete(`/todo/deletetodobyid/${decoded.id}/${todoID}`)
             .then( todo => {
                resolve(todo.data.todos);

             })
             .catch( error => {
                 reject(error);
             })


    });

}

export const apiHandleNewEditTodoByID = (id, currentTodoState) => {

    return new Promise( (resolve, reject) => {

        let newObj = {
            id, 
            newTodo: currentTodoState
        }

        Axios.put('/todo/updatetodobyid',  newObj)
             .then( result => {

                resolve(result.data)
             })
             .catch( error => {
                reject(error)
             })


    })
}

export const apiHandleCompletedByID = (id, bool) => {
    return new Promise((resolve, reject) => {

        Axios.put(`/todo/completetodobyid/${id}`, {
            completed: bool
        })
        .then( completedTodo => {
            resolve(completedTodo)
        })
        .catch( error => {
            reject(error)
        })

    })
}

export const apiHandleGetTodosByCompletion = (completion) => {

 
    return new Promise((resolve, reject) => {


        Axios.get(`/todo/findtodobycategory?completed=${completion}`)
            .then( completionTodo => {
                console.log(completionTodo)
                resolve(completionTodo.data)
            })
            .catch( error => {
                reject(error)
            })

    });
}