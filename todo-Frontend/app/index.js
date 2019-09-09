import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Nav from './components/Nav/Nav'
import TodoList from './components/TodoList/TodoList';

import { 
  handleGetAllTodos,
  apiHandleAddNewTodoList,
  apiHandleDeleteByID,
  apiHandleNewEditTodoByID,
  apiHandleCompletedByID,
  apiHandleGetTodosByCompletion
} from './api/api';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

class App extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      todoList: [],
      todoLibrary: {},
      isAuth: false,
      selected: 'all'
    }

    this.apphandleAddNewTodoList = this.apphandleAddNewTodoList.bind(this);
    this.appHandleDeleteByID = this.appHandleDeleteByID.bind(this)
    this.appHandleCompletedByID = this.appHandleCompletedByID.bind(this)
    this.appHandleNewEditTodoByID = this.appHandleNewEditTodoByID.bind(this)
    this.handleAuthSubmit = this.handleAuthSubmit.bind(this)

    this.handleLogout = this.handleLogout.bind(this)

    this.getAllTodo = this.getAllTodo.bind(this)
    this.handleGetTodosByCompletion = this.handleGetTodosByCompletion.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    
    if (prevState.isAuth === false && this.state.isAuth === true) {
      this.getAllTodo();
    }
  }


  getAllTodo () {

    handleGetAllTodos()
      .then( allTodos => {

        this.setState(({ todoLibrary}) => ({
          todoLibrary: {
            ...todoLibrary,
            ['all']: allTodos.data.todos
          }
        }));
      })
      .catch(error => {
        console.log(error);
      })
  }

   apphandleAddNewTodoList (newTodoFromTodoList) {

    apiHandleAddNewTodoList(newTodoFromTodoList)
      .then( createdNewTodo => {

          this.setState(({ todoLibrary}) => ({
            todoLibrary: {
              ...todoLibrary,
              ['all']: [...todoLibrary.all, createdNewTodo]
            }
          }), () => {

            let newCompleted = this.state.todoLibrary['all'].filter( item => item.completed === true ? item : '' )
            let newNotCompleted = this.state.todoLibrary['all'].filter( item => item.completed === false ? item : '' )
  
            this.setState(({ todoLibrary}) => ({
              todoLibrary: {
                ...todoLibrary,
                ['completed']: newCompleted
              }
            }));
  
            this.setState(({ todoLibrary}) => ({
              todoLibrary: {
                ...todoLibrary,
                ['incomplete']: newNotCompleted
              }
            }));

          });
      })
      .catch( error => {
        console.log(error);
      })
   }

   appHandleDeleteByID (id) {  
     
      apiHandleDeleteByID(id)
        .then( filteredTodos => {
      
          this.setState(({ todoLibrary}) => ({
            todoLibrary: {
              ...todoLibrary,
              ['all']: filteredTodos
            }
          }), () => {
           
            let newCompleted = this.state.todoLibrary['all'].filter( item => item.completed === true ? item : '' )
            let newNotCompleted = this.state.todoLibrary['all'].filter( item => item.completed === false ? item : '' )
  
            this.setState(({ todoLibrary}) => ({
              todoLibrary: {
                ...todoLibrary,
                ['completed']: newCompleted
              }
            }));
  
            this.setState(({ todoLibrary}) => ({
              todoLibrary: {
                ...todoLibrary,
                ['incomplete']: newNotCompleted
              }
            }));

          });

        })
        .catch( error => {
          console.log(error)
        })
   }

   appHandleCompletedByID (id, bool) {

    apiHandleCompletedByID(id, bool)
      .then( completedTodo => {
    
        let newCompletedList = this.state.todoLibrary['all'].map((item) => {
          if (item._id === completedTodo.data._id) {
            item.completed = completedTodo.data.completed
            return item;
          } else {
            return item
          }
        })

        this.setState(({ todoLibrary }) => {
          return {
              todoLibrary: {
                ...todoLibrary,
                ['all']: newCompletedList
              }
          }
        }, () => {

          let newCompleted = this.state.todoLibrary['all'].filter( item => item.completed === true ? item : '' )
          let newNotCompleted = this.state.todoLibrary['all'].filter( item => item.completed === false ? item : '' )

          this.setState(({ todoLibrary}) => ({
            todoLibrary: {
              ...todoLibrary,
              ['completed']: newCompleted,
              ['incomplete']: newNotCompleted
            }
          }));

        })

      })
      .catch( error => {
        console.log(error)
      })

   }

   appHandleNewEditTodoByID(id, newTodo) {
    
    apiHandleNewEditTodoByID(id, newTodo)
      .then( updatedTodo => {
      
        let newCompletedList = this.state.todoLibrary['all'].map((item) => {
          if (item._id === id) {
            item.todo = updatedTodo.todo
            return item;
          } else {
            return item
          }
        })

        this.setState(({ todoLibrary}) => ({
          todoLibrary: {
            ...todoLibrary,
            ['all']: newCompletedList
          }
        }));

      })
      .catch( error => {
        console.log(error);
      })
   }

   handleAuthSubmit() {
    this.setState({
      isAuth: true
    })
   }

   handleLogout() {
    this.setState({
      isAuth: false
    })
   }

  

   handleGetTodosByCompletion(completion) {
     
    let completeBool;
  
    this.setState({
      selected: completion
    })
    
  
    if (completion === 'all') {
      return;
    } else if (completion === 'incomplete') {
      completeBool = false
    } else if ( completion === 'completed') {
      completeBool = true
    }

   
    if (!this.state.todoLibrary[completion]) {

      apiHandleGetTodosByCompletion(completeBool)
      .then( results => {

        this.setState(({ todoLibrary}) => ({
          todoLibrary: {
            ...todoLibrary,
            [completion]: results
          }
        }));


      })
      .catch( error => {
        console.log(error)
      })
    }

    

   }

  render() {

    return (

       <div className="App">
        <Nav 
          handleAuthSubmit={this.handleAuthSubmit}
          handleLogout={this.handleLogout}
        />

      { 
        this.state.isAuth ? ( <> 
        <div id='category'>
          <ul>
            <li onClick={() => this.handleGetTodosByCompletion('all')}><a>All Todos</a></li>
            <li onClick={() => this.handleGetTodosByCompletion('incomplete')}><a>Current Todo</a></li>
            <li onClick={() => this.handleGetTodosByCompletion('completed')}><a>Done</a></li>
          </ul>
        </div>
        <TodoList 
          isAuth={this.state.isAuth}
          todoList={this.state.todoLibrary[this.state.selected]}
          apphandleAddNewTodoList={this.apphandleAddNewTodoList}
          appHandleDeleteByID={this.appHandleDeleteByID}
          appHandleCompletedByID={this.appHandleCompletedByID}
          appHandleNewEditTodoByID={this.appHandleNewEditTodoByID}
        />
        </> ) : (
                <h1>You Need to Login to use this app</h1>
          ) 
        }
      
      </div>

    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)