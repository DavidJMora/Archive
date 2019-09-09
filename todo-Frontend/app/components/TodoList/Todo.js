import React, { Component } from 'react'

export default class Todo extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isToggle: false,
            newEditTodo: this.props.item,
            currentTodo: this.props.item
        }

        this.handleEditOnChange = this.handleEditOnChange.bind(this);
        this.handleEditToggle = this.handleEditToggle.bind(this);

    }
     
    handleEditToggle() {
        this.setState( (prevState) => {
            return {
                isToggle: !prevState.isToggle
            }
        })
    }

    handleEditOnChange (event) {
        this.setState({
            newEditTodo: event.target.value
        })
    }

    render() {

        const { id, 
                item, 
                completed,
                todoHandleDeleteByID, 
                todoHandleCompletedByID,
                todoHandleNewEditTodoByID
            } = this.props;

        return (
            <li key={id} className={`${completed === true ? 'completedTodoLineThrough' : ''}`}>
                        
            { 
                this.state.isToggle ?
                (
                <>
                    <input 
                        defaultValue={item}
                        onChange={this.handleEditOnChange}
                        />
                    <button 
                        className='buttonClass btn btn-danger'
                        onClick={this.handleEditToggle}>
                            Cancel
                    </button>

                    <button 
                        className='buttonClass btn btn-primary' 
                        disabled={this.state.newEditTodo === this.state.currentTodo ? true : false}
                        onClick={() => {
                            todoHandleNewEditTodoByID(id, this.state.newEditTodo);
                            this.handleEditToggle();
                        }}
                        >
                            Submit
                    </button>
                    
                </>
                 ) : (
                     <>
                        {item}
                        <button 
                            className='buttonClass btn btn-success'
                            onClick={this.handleEditToggle}
                            >Edit</button>
                     </>
                 )
                          
            }
        <button 
            onClick={() => todoHandleDeleteByID(id)} 
            className={`buttonClass btn btn-danger ${this.state.isToggle ? 'makeButtonHidden' : ''}`}>
                Delete
        </button>
        <button 
            onClick={() => todoHandleCompletedByID(id, !completed)} 
            className={`buttonClass btn btn-danger ${this.state.isToggle ? 'makeButtonHidden' : ''}`}>
                Done
        </button>
    </li>
        )
    }
}
