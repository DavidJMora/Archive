import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './TodoList.css'
import Todo from './Todo'


export default class TodoList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            newTodo: '',
        }

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleNewTodoSubmit = this.handleNewTodoSubmit.bind(this);
    }

    handleOnChange (event) {
        this.setState({
            newTodo: event.target.value
        })
    }

    handleNewTodoSubmit (event) {
        event.preventDefault();

        this.props.apphandleAddNewTodoList(this.state)

        this.setState({
            newTodo: ''
        })
    }
   
    showTodoList () {
        return this.props.todoList.map((item) => {
            return (
                <Todo 
                    key={item._id}
                    id={item._id}
                    item={item.todo}
                    completed={item.completed}
                    todoHandleDeleteByID={this.props.appHandleDeleteByID}
                    todoHandleCompletedByID={this.props.appHandleCompletedByID}
                    todoHandleNewEditTodoByID={this.props.appHandleNewEditTodoByID}
                />
            )
        })
    }

    render() {
       

        return (
          <>
            <form onSubmit={this.handleNewTodoSubmit}>
                <input 
                    name="newTodo" 
                    value={this.state.newTodo}
                    onChange={this.handleOnChange}
                    />
            <button>Submit</button>
            </form>

            <ul style={styles.listStyle}>
             {
                this.props.todoList ? this.showTodoList() : null
             }
            </ul>

            
          </>
        )
    }
}

TodoList.propTypes = {
    todoList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            todo: PropTypes.string,
            completed: PropTypes.bool
        })
    )
}

const styles = {
    listStyle: {
      listStyleType: 'none'
    }
  }
