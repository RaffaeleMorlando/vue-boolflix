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
    debounce: null,
    isActive: false,
    myList: JSON.parse(localStorage.getItem('movies')),
  },
  mounted(){
    this.getGenres();
  },
  methods: {
    addToMyList: function (movie) {
      if(localStorage.getItem('movies') == null) {
        localStorage.setItem('movies', '[]')
      }

      let oldData = JSON.parse(localStorage.getItem('movies'));
      oldData.push(movie)

      // check if movies or tvshow already exist in my list
      const moviesHashMap = {};
      let newData = oldData.filter(item => {

        let alreadyExist = moviesHashMap.hasOwnProperty(item.id)
       
        return alreadyExist ? false : moviesHashMap[item.id] = true
      });

      console.log(newData);

      localStorage.setItem('movies', JSON.stringify(newData));
      newData = JSON.parse(localStorage.getItem('movies'));
      this.myList = newData;
      this.showMyList();
    },
    showMyList: function() {
      if(this.myList === null) {
        this.searchedList = [];
      } else {
        this.searchedList = this.myList;
      }
      
      for(let i = 0; i < this.searchedList.length; i++ ) {
        this.getCast(this.searchedList[i]);
        this.showGenre(this.searchedList[i]);
      };
      this.$forceUpdate();
    },
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
      this.searchedList = [];
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
    getMoviesPopular: function() {
      this.getCast
      axios.get('https://api.themoviedb.org/3/movie/popular', {
        params: {
          api_key: this.api_key,
          language: 'en-EN'
        }
      })
      .then((result) => {
        this.searchedList = result.data.results;
        for(let i = 0; i < this.searchedList.length; i++ ) {
          this.getCast(this.searchedList[i]);
          this.showGenre(this.searchedList[i]);
        }
        this.$forceUpdate();
      })
    },
    getTvShowPopular: function() {
      console.log('tv show popular');
      this.getCast
      axios.get('https://api.themoviedb.org/3/tv/popular', {
        params: {
          api_key: this.api_key,
          language: 'en-EN'
        }
      })
      .then((result) => {
        this.searchedList = result.data.results;
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
      if(this.selected == ''){
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

//[] Al click sulla stella , il film si aggiunge alla lista dei preferiti




// deleteToMyList: function(index){
//       let newData = JSON.parse(localStorage.getItem('movies'));
//       newData.slice(0,index);
//       this.myList = newData;
//     },
//     addToMyList: function(movie) {
//       console.log('dasddad');
//       if(this.myList == null) {
//         localStorage.setItem('movies', '[]')
//       } else {
//         let oldData = JSON.parse(localStorage.getItem('movies'));
//         let oldDataCopy = oldData;
//         console.log(oldDataCopy);
//         for (let i = 0; i < oldDataCopy.length; i++) {
//           if (oldDataCopy[i].id.includes(movie.id)) {
//             oldData.push(movie)
//           }
//         }

//         localStorage.setItem('movies', JSON.stringify(oldData));
//         let newData = JSON.parse(localStorage.getItem('movies'));
//         this.myList = newData;
//         this.showMyList();
//       }
//     },
//     showMyList: function() {
//       if(this.myList === null) {
//         this.searchedList = [];
//       } else {
//         this.searchedList = this.myList;
//       }
      
//       // for(let i = 0; i < this.searchedList.length; i++ ) {
//       //   this.getCast(this.searchedList[i]);
//       //   this.showGenre(this.searchedList[i]);
//       // };
//       this.$forceUpdate();
//     },