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
      extensionImg: '.svg',
      generesId: [],
      cast:[]
    },
    mounted(){
      this.getPopular();
    },
    methods: {
      getSearched: function() {
        this.getMovies();
        this.getTvShow();

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
      },
      getMovies: function() {
        if(this.searchValue.length != 0) {
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
        } else {
            this.searchedList = this.getPopular();
        }
      },
      getTvShow: function() {
        if(this.searchValue.length != 0) {
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
            console.log(result.data.results);
          })
        } else {
            this.searchedList = this.getPopular();
        }
      },
      getCast: function(movie) {
        
        if(movie.title) {
          axios
          .get(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, {
            params: {
              api_key: this.api_key,
              language: 'en-EN',
            }
          })
          .then((result) => {  
            this.cast = [];
            const castArray = result.data.cast;
            for(let i = 0; i < 4; i++) {
              this.cast.push(castArray[i].name);
            }
          })
        } else {
          axios
          .get(`https://api.themoviedb.org/3/tv/${movie.id}/credits`, {
            params: {
              api_key: this.api_key,
              language: 'en-EN',
            }
          })
          .then((result) => {  
            this.cast = [];
            const castArray = result.data.cast;
            for(let i = 0; i < 4; i++) {
              this.cast.push(castArray[i].name);
            }
          })
        }
      }
    },
    filters: {
      capitalize(value) {
        return value.toUpperCase();
      }
    }
  }
);





 // getInfo: function(index) {
      //   console.log(this.searchedList[index].id);
      //   // this.getCredits(infoId);s
      // },
      // getCredits: function() {
      // }
      // getGeneres: function() {
      //   // ************************
      //   const self = this;
      //   axios
      //   .get('https://api.themoviedb.org/3/genre/tv/list', {
      //     params: {
      //       api_key: this.api_key,
      //       language: 'en-EN',
      //     }
      //   })
      //   .then((result) =>  {
      //     // array con generi 
      //     self.generesId = result.data;
      //     const newArray = self.searchedList.map(
      //       (item) => {
      //         console.log(item);
      //        return item.genre_ids.forEach(
      //           (genres) => {
      //             self.generesId.forEach(
      //             (element) => {
      //             genres.includes(element).item.push(element)
                  
      //           });
      //         });
                
      //       }
      //     )
      //     console.log(newArray);
      //   })
        
      // }




       // getId: function() {
      //   const arrayId = this.searchedList.map(
      //     (movie) => {
      //       return movie.id
      //     }
      //   )
      // }
      // ,
      // getCast: function(arrayId) {
      //   arrayId.forEach(
      //     (id) => {
      //       axios
      //     .get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
      //       api_key: this.api_key,
      //       language: 'en-EN'
      //     })
      //     .then((result) => {
      //       console.log(result);
      //     })
      //   }
      //   );
        
      // }