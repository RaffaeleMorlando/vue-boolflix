const app = new Vue(
  {
    el: '#app',
    data: {
      searchValue: '',
      moviesList: [],
      prefixUrl: 'https://image.tmdb.org/t/p/w220_and_h330_face/'
    },
    updated() {
      if(this.searchValue == 0) {
        this.goToHome();
      }
    },
    mounted(){
      this.goToHome();
    },
    methods: {
      getMovies: function() {
        if(this.searchValue.length != 0) {
          axios
          .get('https://api.themoviedb.org/3/search/movie', {
            params: {
              api_key: '235a6ac442ac4f61d5783c4fbcc2b7ae',
              query: this.searchValue,
              language: 'en-EN'
            }
          })
          .then((result) =>  {
            this.moviesList = [];
            this.moviesList = result.data.results
            console.log(this.moviesList);
          })
        } else {
          this.moviesList = '';
        }
      },
      goToHome: function() {
        axios
        .get('https://api.themoviedb.org/3/movie/popular', {
          params: {
            api_key: '235a6ac442ac4f61d5783c4fbcc2b7ae',
            language: 'en-US'
          }
        })
        .then((result) => {
          this.moviesList = result.data.results;
        })
      }
    },
  }
);


