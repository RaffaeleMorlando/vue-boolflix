//[]indicare la sezione attuale, per caricare pagine della stessasezione quando scrollbar arriva alla fine
//[] reset page count to 1


const app = new Vue(
 {
   el: '#app',
   data: {
    searchValue: '',
    searchedList: [],
    searchedListCopy: [],
    api_key: '235a6ac442ac4f61d5783c4fbcc2b7ae',
    language: 'en-US',
    movieUrl: 'https://api.themoviedb.org/3/search/movie',
    tvShowUrl: 'https://api.themoviedb.org/3/search/tv',
    popularUrl: 'https://api.themoviedb.org/3/trending/all/day',
    prefixUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2',
    urlImg:'img/imgflags/',
    extensionImg: '.svg',
    genres: [],
    selected: '',
    debounce: null,
    myList: JSON.parse(localStorage.getItem('movies')),
    section: false,
    sections: {},
    page: 1,
    showLoader: false
  },
  mounted(){
    this.getGenres();
    this.scrollTrigger();
  },
  methods: {
    scrollTrigger: function() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          console.log(entry);
          if(entry.intersectionRatio > 0) {
            this.showLoader = true;
            console.log(this.sections)
            let url = '';
            if(this.sections.tvShow === true){
              url = 'https://api.themoviedb.org/3/tv/popular';
            } else if (this.sections.movie === true){
              url = 'https://api.themoviedb.org/3/movie/popular';
            } else if(this.sections.home === true) {
              url = this.popularUrl;
            } else if(this.sections.topRated === true) {
              url = 'https://api.themoviedb.org/3/movie/top_rated'
            } else {
              url = 'https://api.themoviedb.org/3/tv/popular';
            }
            axios.get(url, {
              params: {
                api_key: this.api_key,
                language: this.language,
                page: this.page++
              }
            })
            .then((result) => {
              let newArray = result.data.results
              this.searchedListCopy = this.searchedList;

              this.searchedList = this.searchedList.concat(newArray);

              if(this.sections.myList === true) {
                this.searchedList = JSON.parse(localStorage.getItem('movies'));
                this.showLoader = false;
              }
              console.log(this.searchedList);
              for(let i = 0; i < this.searchedList.length; i++ ) {
                this.getCast(this.searchedList[i]);
                this.showGenre(this.searchedList[i]);
              }
            })
          }
        })
      });
      observer.observe(this.$refs.infiniteScrollTrigger);
    },
    getTopRated: function() {
      this.page = 1;
      this.sections = {};
      this.sections.topRated = true;
      axios.get('https://api.themoviedb.org/3/movie/top_rated',{
        params: {
          api_key: this.api_key,
          language: this.language
        }
      })
      .then((result) => {
        this.searchedList = result.data.results;
        this.searchedListCopy = this.searchedList;
        for(let i = 0; i < this.searchedList.length; i++ ) {
          this.getCast(this.searchedList[i]);
          this.showGenre(this.searchedList[i]);
        }
      });
    },
    deleteToMyList: function(index) {
      let newArray = this.myList;
      newArray.splice(index,1);
      localStorage.setItem('movies',JSON.stringify(newArray));
      let newData = JSON.parse(localStorage.getItem('movies'));
      this.myList = newData;
      this.showMyList();
    },
    addToMyList: function (movie) {
      if(localStorage.getItem('movies') == null) {
        localStorage.setItem('movies', '[]');
      };

      let oldData = JSON.parse(localStorage.getItem('movies'));
      oldData.push(movie);

      // check if movies or tvshow already exist in my list
      const moviesHashMap = {};
      let newData = oldData.filter(item => {

        let alreadyExist = moviesHashMap.hasOwnProperty(item.id);
       
        return alreadyExist ? false : moviesHashMap[item.id] = true;
      });

      console.log(moviesHashMap);

      localStorage.setItem('movies', JSON.stringify(newData));
      newData = JSON.parse(localStorage.getItem('movies'));
      this.myList = newData;
      this.showMyList();
    },
    showMyList: function() {
      this.page = 1;
      this.section = true;
      this.sections = {};
      this.sections.myList = true;
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
      this.page = 1;
      this.section = false;
      this.sections = {};
      this.sections.home = true;
      axios.get(this.popularUrl, {
        params: {
          api_key: this.api_key,
          language: this.language,
          media_type: 'all',
          time_window: 'day'
        }
      })
      .then((result) => {
        this.searchedList =result.data.results;
        this.searchedListCopy = this.searchedList;
        for(let i = 0; i < this.searchedList.length; i++ ) {
          this.getCast(this.searchedList[i]);
          this.showGenre(this.searchedList[i]);
        }
      })
    },
    getSearched: function() {
      this.section = false;
      this.searchedList = [];
      if(this.searchValue == '') {
        this.getPopular();
      } else {
        this.getMovies();
        this.getTvShow();
      }
    },
    getMovies: function() {
      this.page = 1;
      this.section = false;
      this.searchedList = [];
      axios
      .get(this.movieUrl, {
        params: {
          api_key: this.api_key,
          query: this.searchValue,
          language: this.language,
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
      this.page = 1;
      this.section = false;
      axios
      .get(this.tvShowUrl, {
        params: {
          api_key: this.api_key,
          query: this.searchValue,
          language: this.language,
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
      this.page = 1;
      this.section = false;
      this.sections = {}
      this.sections.movie = true;
      this.getCast
      axios.get('https://api.themoviedb.org/3/movie/popular', {
        params: {
          api_key: this.api_key,
          language: this.language
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
      this.page = 1;
      this.section = false;
      this.sections = {};
      this.sections.tvShow = true;
      console.log('tv show popular');
      this.getCast
      axios.get('https://api.themoviedb.org/3/tv/popular', {
        params: {
          api_key: this.api_key,
          language: this.language
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
          language: this.language
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

