import React, { Component } from 'react'
import { getMovies } from './getMovies'
import axios from 'axios';

export default class Movies extends Component {
    constructor() {
        super();
        this.state = {
            movies: [],
            currSearchText: "",
            currPage: 1,
            currLimit: 4,
            genres: [{ _id: "abcd", name: "All Genres" }],
            currGenre: "All Genres",
        }
    }

    async componentDidMount() {
        console.log("component did mount");
        let res = await axios.get("https://backend-react-movie.herokuapp.com/movies");
        let genreRes = await axios.get("https://backend-react-movie.herokuapp.com/genres");
        this.setState({
            movies: res.data.movies,
            genres: [...this.state.genres, ...genreRes.data.genres]
        })
    }

    onDelete = (movieId) => {
        let arr = this.state.movies.filter(function (movieObj) {
            return movieObj._id !== movieId;
        })
        this.setState({
            movies: arr
        })
    }

    handleChange = (e) => {
        let val = e.target.value;

        this.setState({
            currSearchText: val
        })
    }

    // onSearch = (e) => {
    //     let val = e.target.parentElement.children[0].value;

    //     this.setState({
    //         currSearchText: val
    //     })
    // }

    sortByRatings = (e) => {
        let className = e.target.className;
        let property = e.target.parentElement.innerText;
        if (property === "Stock") {
            property = "numberInStock";
        } else {
            property = "dailyRentalRate";
        }
        let sortedMovies = [];
        if (className === 'fa fa-sort-asc') {
            sortedMovies = this.state.movies.sort(function (movieObjA, movieObjB) {
                return movieObjA[property] - movieObjB[property];
            })
        }
        else {
            sortedMovies = this.state.movies.sort(function (movieObjA, movieObjB) {
                return movieObjB[property] - movieObjA[property];
            })
        }

        this.setState({
            movies: sortedMovies
        })
    }

    handlePageChange = (pageNumber) => {
        this.setState({
            currPage: pageNumber
        })
    }

    handleGenreChange = (e) => {
        this.setState({
            currGenre: e.currentTarget.innerText
        })
    }

    handleLimitChange = (e) => {
        this.setState({
            currLimit: e.currentTarget.value
        })
    }

    render() {
        let { movies, currSearchText, currPage, currLimit, genres, currGenre } = this.state;
        let filteredArr;

        if (currSearchText === "") {
            filteredArr = movies;
        }
        else {
            filteredArr = movies.filter((movieObj) => {
                let title = movieObj.title.trim().toLowerCase();
                return title.includes(currSearchText.toLowerCase());
            })
        }

        if (currGenre !== "All Genres") {
            filteredArr = filteredArr.filter((movieObj) => {
                return movieObj.genre.name === currGenre;
            })
        }

        let numberOfPages = Math.ceil(filteredArr.length / currLimit);
        let pageNumberArr = [];
        for (let i = 0; i < numberOfPages; i++) {
            pageNumberArr.push(i + 1);
        }
        let si = (currPage - 1) * currLimit;
        let ei = si + currLimit;
        filteredArr = filteredArr.slice(si, ei);
        if (filteredArr.length == 0 && movies.length != 0 && currPage != 1) {
            this.setState({
                currPage: 1
            })
        }

        // let genres = ['Action', 'Comedy', 'Mystery', 'Romance', 'Thriller'];

        return (
            <>
                {
                    this.state.movies.length == 0 ? <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div> :
                    <div style={{ paddingTop: "40px" }} className="container">
                        {/* <div style={{ paddingTop: "15px", paddingBottom: "15px" }}>
                            <h1 className="display-6 text-center">Movies React App</h1>
                        </div> */}

                        <div className="row">
                            <div className="col-3" style={{ paddingTop: "15px", paddingRight: "25px" }}>
                                <p className="h3 text-center">Genres</p>

                                <ul className="list-group" style={{ paddingTop: "10px" }}>
                                    {
                                        genres.map((genreObj) => {
                                            let classStyle = (genreObj.name === currGenre) ? "list-group-item active" : "list-group-item";
                                            return (
                                                <li key={genreObj._id} onClick={this.handleGenreChange} className={classStyle} aria-current="true">{genreObj.name}</li>
                                            )
                                        })

                                    }

                                </ul>
                            </div>

                            <div className="col-9">
                                <div style={{ display: "flex" }}>
                                    <div style={{ paddingBottom: "8px", width: "500px" }} className="input-group mb-3">
                                        <input title="Search Text" type="text" className="form-control" placeholder="Enter Search Text" aria-label="Recipient's username" aria-describedby="button-addon2" onChange={this.handleChange} value={this.state.currSearchText}></input>
                                        <img style={{ paddingLeft: "8px" }} src="https://img.icons8.com/android/32/000000/search.png" />
                                    </div>

                                    <div style={{ paddingBottom: "8px", width: "250px", paddingLeft: "25px" }} className="input-group mb-3">
                                        <input title="Movies per Page" type="number" className="form-control" placeholder="Enter limit" aria-label="Recipient's username" aria-describedby="button-addon2" onChange={this.handleLimitChange} value={this.state.currLimit}></input>
                                        <img style={{ paddingLeft: "8px" }} src="https://img.icons8.com/ios-glyphs/30/000000/123.png" />
                                    </div>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Title</th>
                                            <th scope="col">Genre</th>
                                            <th scope="col">
                                                <i onClick={this.sortByRatings} className="fa fa-sort-asc" aria-hidden="true"></i>
                                                Stock
                                                <i onClick={this.sortByRatings} className="fa fa-sort-desc" aria-hidden="true"></i>
                                            </th>
                                            <th scope="col">
                                                <i onClick={this.sortByRatings} className="fa fa-sort-asc" aria-hidden="true"></i>
                                                Rate
                                                <i onClick={this.sortByRatings} className="fa fa-sort-desc" aria-hidden="true"></i>
                                            </th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            filteredArr.map((movieObj) => {
                                                return (
                                                    <tr scope='row' key={movieObj._id} >
                                                        <td></td>
                                                        <td>{movieObj.title}</td>
                                                        <td>{movieObj.genre.name}</td>
                                                        <td>{movieObj.numberInStock}</td>
                                                        <td>{movieObj.dailyRentalRate}</td>
                                                        <td><button type="button" className="btn btn-danger" onClick={() => {
                                                            this.onDelete(movieObj._id)
                                                        }}>Delete</button></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>

                                <nav aria-label="...">
                                    <ul className="pagination">
                                        {
                                            pageNumberArr.map((pageNumber) => {
                                                let classStyle = pageNumber === currPage ? 'page-item active' : 'page-item';
                                                return (
                                                    <li key={pageNumber} onClick={() => this.handlePageChange(pageNumber)} className={classStyle}><span className="page-link">{pageNumber}</span></li>
                                                )
                                            })
                                        }
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }
}
