import React, { Component } from 'react'
import { handleSignUpAndLogInApi, apiAuth } from '../../api/api';


export default class Nav extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorToggle: false,
            errorMessage: '',
            isAuth: false, 
            loggedInEmail: ''
        }

        this.handleInputOnChange = this.handleInputOnChange.bind(this);
        this.handleInputSubmit = this.handleInputSubmit.bind(this);
        this.logout = this.logout.bind(this);
    } 

    componentDidMount() {
        apiAuth()
            .then( userObj => {
    
                this.setState({
                    isAuth: true,
                    loggedInEmail: userObj.email
                }, () => {
                    this.props.handleAuthSubmit()
                })
            })
            .catch( error => {
                console.log(error)
            })
    }


    handleInputOnChange (event) {

        this.setState({
            [event.target.name]: event.target.value
        })

    }

    handleInputSubmit (event) {
        event.preventDefault(); 
        handleSignUpAndLogInApi({
            email: this.state.email,
            password: this.state.password
        })
        .then( result => {
            
            const { email } = result;
            this.setState({
                isAuth: true, 
                loggedInEmail: email,
                email: '',
                password: '',
                errorToggle: false, 
                errorMessage: ''
            }, () => {
      
                this.props.handleAuthSubmit()
            });
            

        })
        .catch(errorMessage => { 
            this.setState({
                errorToggle: true,
                errorMessage: errorMessage 
            })

        })
    }

    logout () {
       
        this.setState({
            isAuth: false
        }, () => {
            this.props.handleLogout()
            localStorage.removeItem('jwtToken');
        })
    }

    render() {
        return (
            <>
            <nav className="navbar navbar-light bg-light">
            <a className="navbar-brand">Navbar</a>
            {
                this.state.isAuth ? (
                    <>
                        <span>{this.state.loggedInEmail}</span>
                        <button className='btn btn-warning' onClick={this.logout}>Log Out</button>
                    </>
                ) : (
                    <form className="form-inline" onSubmit={this.handleInputSubmit}>
                    <input 
                      type='text' 
                      className="form-control mr-sm-2" 
                      placeholder="email" 
                      aria-label="email" 
                      name='email'
                      value={this.state.email}
                      onChange={this.handleInputOnChange}
                      />
                    <input 
                      type='text' 
                      className="form-control mr-sm-2" 
                      placeholder="password" 
                      aria-label="password"
                      name='password'
                      value={this.state.password} 
                      onChange={this.handleInputOnChange}
                      />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Sign Up | Sign In</button>
                  </form>
                )
            }
          </nav>
          <span
             style={{padding: '0px'}}
             className={this.state.errorToggle ? 'alert alert-danger' : ''}>
             {this.state.errorToggle ? this.state.errorMessage : ''}
          </span>
        </>
        )
    }
}
