import React, { Component } from 'react'
import './nav.css';
import {Link} from 'react-router-dom';

export default class Nav extends Component {
    render() {
        return (
            <div>
                <nav className="navbar">
                    <h2>Movies React App</h2>
                    <ul className="list">
                        <Link style={{ textDecoration: 'none' }} to="/"><li>Home</li></Link>
                        <Link style={{ textDecoration: 'none' }} to="/about"><li>About</li></Link>
                        <Link style={{ textDecoration: 'none' }} to="/movies"><li>Movies</li></Link>     
                    </ul>
                </nav>
            </div>
        )
    }
}
