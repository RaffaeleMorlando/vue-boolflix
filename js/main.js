// [] add debounce function to inputsearch

const app = new Vue(
 {
   el: '#app',
   data: {
    searchValue: '',
    searchedList: [],
    searchedListCopy: [],
    api_key: '235a6ac442ac4f61d5783c4fbcc2b7ae',
    movieUrl: 'https://api.themoviedb.org/3/search/movie',
    tvShowUrl: 'https://api.themoviedb.org/3/search/tv',
    popularUrl: 'https://api.themoviedb.org/3/trending/all/day',
    prefixUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2',
    urlImg:'img/imgflags/',
    extensionImg: '.svg',
    genres: [],
    selected: '',
    debounce: null
  },
  mounted(){
    this.getGenres();
  },
  methods: {
    getPopular: function() {
      axios.get(this.popularUrl, {
        params: {
          api_key: this.api_key,
          language: 'en-US',
          media_type: 'all',
          time_window: 'day'
        }
      })
      .then((result) => {
        this.searchedList = result.data.results;
        this.searchedListCopy = this.searchedList;
        for(let i = 0; i < this.searchedList.length; i++ ) {
          this.getCast(this.searchedList[i]);
          this.showGenre(this.searchedList[i]);
        }
      })
    },
    getSearched: function() {
      this.searchedList = [];
      if(this.searchValue == '') {
        this.getPopular();
      } else {
        this.getMovies();
        this.getTvShow();
      }
    },
    getMovies: function() {
      axios
      .get(this.movieUrl, {
        params: {
          api_key: this.api_key,
          query: this.searchValue,
          language: 'en-EN',
        }
      })
      .then((result) =>  {
        this.searchedList = result.data.results;
        this.searchedListCopy = this.searchedList;
        for(let i = 0; i < this.searchedList.length; i++ ) {
          this.getCast(this.searchedList[i]);
          this.showGenre(this.searchedList[i]);
        }
        this.$forceUpdate();
      })
    },
    getTvShow: function() {
      axios
      .get(this.tvShowUrl, {
        params: {
          api_key: this.api_key,
          query: this.searchValue,
          language: 'en-EN',
        }
      })
      .then((result) =>  {
        this.searchedList.push(...result.data.results);
        this.searchedListCopy = this.searchedList;
        for(let i = 0; i < this.searchedList.length; i++ ) {
          this.getCast(this.searchedList[i]);
          this.showGenre(this.searchedList[i]);
        }
        this.$forceUpdate();
      })
    },
    getCast: function(movie) {
      movie.cast = [];
      let endpoint = '';
      if(movie.title) {
        endpoint = `https://api.themoviedb.org/3/movie/${movie.id}/credits`;
      } else {
        endpoint = `https://api.themoviedb.org/3/tv/${movie.id}/credits`;
      }
      axios.get(endpoint, {
        params: {
          api_key: this.api_key,
          language: 'en-EN',
        }
      })
      .then((result) => {  
        const castArray = result.data.cast;
        for(let i = 0; i < castArray.length; i++) {
          if (movie.cast.length <= 4) {
            movie.cast.push(castArray[i].name);
          }
        }
        this.$forceUpdate();
      })
    },
    getGenres: function() {
      axios.get('https://api.themoviedb.org/3/genre/movie/list', {
        params: {
          api_key: this.api_key
        }
      })
      .then((result) => {
        this.genres = result.data.genres;
        this.getPopular();
      });
    },
    showGenre: function(movie) {
      movie.genres = [];
      movie.genre_ids.forEach(
        (id) => {
          this.genres.forEach(
            (ids) => {
              if(id === ids.id) {
                movie.genres.push(ids.name);
              }
            }
          )
        }
      )
    },
    filtredByGenre: function() {
      if(this.selected == ' '){
        this.searchedList = this.searchedListCopy;
      } else {
        this.searchedList = this.searchedListCopy;
        const filteredCard = this.searchedListCopy.filter(
          (movie) => {
            return movie.genre_ids.includes(this.selected);
          }
        );
        this.searchedList = filteredCard;
      }
    },
    debounceSearch: function(callback) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        callback();
      }, 500)
    }
  },
  filters: {
    capitalize(value) {
      return value.toUpperCase();
    }
  }
}
);

