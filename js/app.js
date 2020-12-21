const app = new Vue(
  {
    el: '#app',
    data: {
      searchValue: '',
      searchedList: [],
      api_key: '235a6ac442ac4f61d5783c4fbcc2b7ae',
      movieUrl: 'https://api.themoviedb.org/3/search/movie',
      tvShowUrl: 'https://api.themoviedb.org/3/search/tv',
      popularUrl: 'https://api.themoviedb.org/3/trending/all/day',
      prefixUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2',
      urlImg:'img/imgflags/',
      extensionImg: '.svg'
    },
    mounted(){
      this.getPopular();
    },
    methods: {
      getSearched: function() {
        if(this.searchValue.length != 0) {
          // movies
          axios
          .get(this.movieUrl, {
            params: {
              api_key: this.api_key,
              query: this.searchValue,
              language: 'en-EN',
            }
          })
          .then((result) =>  {
            this.searchedList = [];
            this.searchedList = result.data.results
            console.log(result.data.results);
          })
           // tv shows
          axios
          .get(this.tvShowUrl, {
            params: {
              api_key: this.api_key,
              query: this.searchValue,
              language: 'en-EN',
            }
          })
          .then((result) =>  {
            this.searchedList = [...result.data.results];
          })
        } else {
          this.searchedList = this.getPopular();
        }
      },
      // show all daily trendings tv shows / movies 
      getPopular: function() {
        axios
        .get(this.popularUrl, {
          params: {
            api_key: this.api_key,
            language: 'en-US',
            media_type: 'all',
            time_window: 'day'
          }
        })
        .then((result) => {
          this.searchedList = result.data.results;
        })
      }
    },
    filters: {
      capitalize(value) {
        return value.toUpperCase();
      }
    }
  }
);
