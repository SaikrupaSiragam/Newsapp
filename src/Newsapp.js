import React from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

const countries = ['in','ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz' ,'de', 'eg',  'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il',  'it', 'jp', 'kr', 'lt', 'ma', 'mx', 'my', 'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro', 'rs', 'ru', 'sa', 'se' ,'sg', 'si', 'sk', 'th', 'tr', 'tw', 'ua', 'us', 've', 'za']
const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];


export default class Newsapp extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            category:'general',
            country: 'in',
            articles: [],
            loading: true,
            results:0,
            page:0
        }
    }

    handleLoadnews = () => {
        axios({
            url: 'https://newsapi.org/v2/top-headlines',
            method:'GET',
            params:{
                country: this.state.country,
                category: this.state.category,
                apiKey: 'bafb402f92b043068b51839a399fb6c3',
                page: this.state.page + 1
            }
        }).then((response) => {
            this.setState({
                articles: [...this.state.articles, ...response.data.articles],
                loading: false,
                results: response.data.results,
                page: this.state.page + 1
            })
        }).catch((err)=>{
            console.log(err);
            this.setState({
                loading: false
            })
        })
    }
    
    componentDidMount(){
        this.handleLoadnews();
    }

    shouldComponentUpdate(prevState, prevProps){
        return true;
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.country!=this.state.country){
            this.handleLoadnews();
        }
        else if(prevState.category != this.state.category){
            this.handleLoadnews();
        }
    }
    
    handleCountryChange = (country) =>{
        this.setState({
            country: country,
            category: 'general',
            articles: [],
            loading: true,
            results: 0,
            page: 0
        })
    }

    handleCategoryChange = (category) => {

        this.setState({
            category: category,
            articles: [],
            loading: true,
            results: 0,
            page: 0
        })
    }


    render(){
        return(
            <div>
                <div>Select Country 
                    {
                        countries.map((value, index) => {
                            return (
                                <button
                                    className={this.state.country == value ? 'btn btn-danger' : 'btn btn-primary'}
                                    style={{margin: '5px'}}
                                    onClick={() => { this.handleCountryChange(value)}}
                                > {value}</button>
                            )
                        })
                    }
                </div><hr/>
                   <div>
                    {
                        categories.map((value, index) => {
                            return (
                                <button
                                    className={this.state.category == value ? 'btn btn-danger' : 'btn btn-primary'}
                                    style={{margin: '10px'}}
                                    onClick={() => { this.handleCategoryChange(value)}}
                                >
                                    {value}
                                </button>
                            )
                        })
                    }
                </div>
                {
                    this.state.loading ?
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div> :
                        null
                }

                {
                    !this.state.loading && this.state.articles.length == 0 && (
                        <div>
                            Sorry, No news 
                        </div>
                    )
                }

                <InfiniteScroll
                    dataLength={this.state.results}
                    next={this.handleLoadnews}
                    hasMore={this.state.results != this.state.articles.length}
                    loader={
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    }
                >
                    {
                        !this.state.loading && this.state.articles.length > 0  && (
                            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                                {
                                    this.state.articles.map((article, index) => {
                                        return (
                                           <div class="card" style={{width: '18rem', margin: '10px'}}>
                            <img src={article.urlToImage} style={{width:'30%', height:'40%'}}class="card-img-top" />
                            <div class="card-body">
                                <h5 class="card-title">{article.title}</h5>
                                   <p class="card-text">{article.description}</p>
                            </div>                       
                         <div>
                            <a href={article.url} target='_blank'><button>read more</button></a> 
                        </div>    
                  </div>    
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                </InfiniteScroll>

            </div>
        )
    }
}