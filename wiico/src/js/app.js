(function wiico(window){
  var container = document.querySelectorAll('.how-long')[0],
        input = document.querySelector("input[type=text]"),
        submit = document.querySelector(".submit"),
        movie_title = document.querySelector(".movie-title"),
        int_date = document.querySelector(".release-date"),
        interval;

  var backgrounds = ['images/wall-e.jpg','images/starwars.jpg','images/robots.jpg','images/pirates.jpg'];

  var bgCount = 0;
  document.body.style.backgroundImage = 'url('+ backgrounds[bgCount] +')';

  var introBackgrounds = function(){
      var bgContainer = document.body.style.backgroundImage;
      bgContainer = 'url('+ backgrounds[bgCount] +')';
      bgCount = (bgCount + 1)%backgrounds.length;
      bgContainer = 'url('+ backgrounds[bgCount] +')';
  }
  var initialBackgrounds = setInterval(introBackgrounds,4000);
  var submitMovie = function(e){
      var userInput = input.value;
      var addzero = function(type){
          if(Math.floor(type) < 10){
              type = '0' + Math.floor(type);
          }else{
              type =  Math.floor(type);
          }
          return type;
      }
      var requestTime = function(rd){
          var later = new Date(rd);
          var now = new Date();
          var tog = later - now;
          var sec = ((later - now)/1000)%60;//seconds
          var min = (((later - now)/1000)/60)%60; // minutes
          var hrs = ((((later - now)/1000)/60)/60)%24; //hrs
          var days = (((((later - now)/1000)/60)/60)/24); //days

          var timeTo = {
              s: sec,
              m: min,
              h: hrs,
              d: days
          }
          return timeTo;
      }
      fetch('https://api.themoviedb.org/3/search/movie?api_key=4650b6df4cd0d7388c64bd5a0823a95d&query=' + userInput + '&append_to_response=releases', {
        method: 'GET'
      }).then(function(response){
          return response.json()
      }).then(function(data){
        clearInterval(initialBackgrounds);

        var backdrop = data.results[0].backdrop_path;
        var releaseDate = data.results[0].release_date;
        var rdArr = releaseDate.split('-'); //split release to array [year,moth,day]
        var rdString = rdArr[1] + '/' + rdArr[2] + '/' + rdArr[0]; //concetante array items to best date format m/d/yyyy
        var rdCal = rdArr[0] + '' + rdArr[1] + '' + rdArr[2];

        console.log(rdCal);
        //cal- https://calendar.google.com/calendar/render?action=TEMPLATE&trp=false&text=hCalendar+annotated+event&dates=20100908/20100908

        document.body.style.backgroundImage = 'url(https://image.tmdb.org/t/p/w1400_and_h450_bestv2/' + backdrop +')';
        movie_title.textContent = '' + data.results[0].title + '';
        int_date.innerHTML = '<a href="https://calendar.google.com/calendar/render?action=TEMPLATE&trp=false&text=' + data.results[0].title + '&dates=' + rdCal + '/' + rdCal + '&details='+ data.results[0].overview +'" target="_blank">' + rdString + '</a>';

        var towhen = function(){
            var timeTo = requestTime(rdString);
            if(timeTo.d < 0){
                clearInterval(interval);
                container.innerHTML = "<span class='movie-error'>This movie came out already ¯\\_(ツ)_/¯<span>";
            }else{
               timeTo.s = addzero(timeTo.s);
               timeTo.m = addzero(timeTo.m);
               timeTo.h = addzero(timeTo.h);
               timeTo.d = addzero(timeTo.d);

               container.innerHTML =  "<h2 class='num'>" + timeTo.d + "<span class='num-label'>days</span></h2>" + "<h2 class='num'>" + timeTo.h + "<span class='num-label'>Hours</span></h2><h2 class='num'>" + timeTo.m + "<span class='num-label'>Min</span></h2><h2 class='num'>"+ timeTo.s + "<span class='num-label'>Sec</span></h2>";
            }
        }

        clearInterval(interval);
        interval = setInterval(towhen,1000);
      }).catch(function(err){
          console.log(err);
      });
  }
  submit.onclick = submitMovie;
  window.document.addEventListener("keypress", function(e){
    if(e.key === 'Enter') submitMovie();
  })
})(this);
