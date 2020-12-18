// API-KEY
// https://api.themoviedb.org/3/movie/550?api_key=235a6ac442ac4f61d5783c4fbcc2b7ae



const app = new Vue(
  {
    el: '#app',
    data: {
      searchValue: '',
      moviesList: []
    },
    methods: {
      getMovies: function() {
        const self = this;
        axios
        .get('https://api.themoviedb.org/3/movie/550?', {
          params: {
            api_key: '235a6ac442ac4f61d5783c4fbcc2b7ae',
            query: self.searchValue,
            language: 'it-IT'
          }
        })
        .then(function(result) {
          self.moviesList = [];
          self.moviesList.push(result.data);
          console.log(result.data);
        })
      }
    }
  }
);

// const card = document.querySelector('.movie-inner-card');
// card.addEventListener('click', function() {
//   card.classList.toggle('is-flipped')
//   console.log('is flipped');
// });