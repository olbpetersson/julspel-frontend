import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'

const backendURL = "http://localhost:8080"
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      question: { 
        id: -1,
        description: "Loading data..."
      },
      userId: undefined,
      hasAnswered: false
    };
    console.log('state', this.state)

    this.answerQuestion.bind(this)
    this.getOrSetName.bind(this)
    this.fetchAndSetName.bind(this)
  }
  render() {
    if(this.state.hasAnswered) {
      return (
        <div className="App container">
          <div className="row">
            <div className="col-md-4 offset-md-4 mt-5">
              <header className="App-header">
              <h1 className="center-text">Julspelet</h1>
              </header>
            </div>
          </div>
          <div className="row center-text mt-5">
            <div className="col-md-6 offset-md-3">
              <p className="text-monospace">Tack för ditt svar!</p>
            </div>
          </div>
          <div className="row mt-5">
          <div className="col-md-6 offset-md-3 center-text">
              <p>
                <small>Du spelar som {this.state.userId}</small>
              </p>
          </div>
          </div>
        </div>
      );
    }
    return (
      <div className="App container">
        <div className="row">
          <div className="col-md-4 offset-md-4 mt-5">
            <header className="App-header">
            <h1 className="center-text">Julspelet</h1>
            </header>
          </div>
        </div>
        <div className="row center-text mt-5">
          <div className="col-md-6 offset-md-3">
            <p className="text-monospace">{this.state.question.description}</p>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-6 offset-md-3 center-text">
            <button className="btn btn-lg btn-success m-3" onClick={() => this.answerQuestion(true)}>Sant</button>
            <button className="btn btn-lg btn-danger" onClick={() => this.answerQuestion(false)}>Falskt</button>
          </div>
        </div>
        <div className="row mt-5">
        <div className="col-md-6 offset-md-3 center-text">
            <p>
              <small>Du spelar som {this.state.userId}</small>
            </p>
        </div>
        </div>
      </div>
    );
  }

  answerQuestion(answer) {
    // Fixa tack för ditt svar
    // fixa userId
    let answerDto = {
      userId: this.state.userId,
      answer: answer,
      questionId: this.state.question.id
    }
    console.log(answerDto)
    fetch(backendURL + '/question/validate', {
      method: 'post',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(answerDto)
    })
    .then(response => {
      this.setState((prevState) => {
        prevState.hasAnswered = true
        return prevState
      })
    })
    .catch((error) => {
      console.log('Request failed', error);
    });

  }


  getOrSetName() {
    let self = this
    let maybeUser = localStorage.getItem('julspelet');
    console.log('got maybeuser', maybeUser)
    console.log(maybeUser == null)
    if(maybeUser === "undefined" || maybeUser == null) {
      console.log('requesting user')
      self.fetchAndSetName().then(u => {
        console.log('got user', u)

        localStorage.setItem('julspelet', u._id)
        self.setState( (prevState) => {
          prevState.userId = u._id
          return prevState
        })
      })
    } else {
      console.log('entered else')
      self.setState((prevState) => {
        prevState.userId = maybeUser
        return prevState
      })
    }

    console.log('localstorage', maybeUser)
  }

  fetchAndSetName() {
     return fetch(backendURL + '/user', {
      method: 'post',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: ''
    })
    .then(response => response.json()
    .then((data) => {
      console.log('Request succeeded with JSON response', data);
      return data
    }))
    .catch((error) => {
      console.log('Request failed', error);
    });
    
  }

  componentWillMount() {
    this.getOrSetName()
    let self = this
    fetch(backendURL + "/question")
      .then(
        (response)  => {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
    
          // Examine the text in the response
          response.json().then((data) => {
            self.setState((prevState) => {
              console.log('setting q', data)
              prevState.question = data
              return prevState
            });
          });
        }
      )
      .catch((err) => {
        console.log('Fetch Error :-S', err);
      });
  }
}




export default App;
