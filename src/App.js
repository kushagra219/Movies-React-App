import Movies from './Components/Movies';
import About from './Components/About';
import Home from './Components/Home';
import Nav from './Nav';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
    return (
        // <h1>Hello</h1>
        <Router>
            <Nav />
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/movies' component={Movies} />
                <Route path='/about' render={(props) => (<About {...props} isAuth={true} />)} />
            </Switch>
        </Router>
    );
}

export default App;
