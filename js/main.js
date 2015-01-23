var threads = {};
var userInfo = {};
var repos = [];
var sd = new Showdown.converter();
var search = '';

$(function () {
  $('#backbutton').fadeOut();
  $('#forwardbutton').fadeOut();
  $('#help').hide();

  if (localStorage.userInfo) {
        /*jshint multistr: true*/
    $('.1').html('\
                 <h3 class="text-success"><span class="glyphicon glyphicon-ok"></span> You\'re already signed in!</h3>\
                 ');
    $('.1').attr('class', 'col-md-3 col-md-offset-0 fade-in 1 out');
    $('.2').attr('class', 'col-md-4 col-md-offset-4 fade-in shadow-box 2');
    $('.3').attr('class', 'col-md-3 col-md-offset-10 fade-in out 3');
    userInfo = JSON.parse(localStorage.userInfo);
    loadRepos();
  }
});


function loadRepos () {
    /*jshint multistr: true*/
    $('.repos').html('\
          <div class="progress">\
            <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>\
          </div>\
          <p class="text-muted">We are getting all your repos now...</p>\
    ');

    $.ajax('https://api.github.com/users/'+userInfo.username+'/subscriptions').then(function (d) {
      repos = d.filter(function (e) { return e.full_name.indexOf(search) != -1; });

      $('.repos').html('');
      repos.forEach(function (e) {
        /*jshint multistr: true*/
        $('.repos').append('\
                           <a class="list-group-item repo">\
                           <span class="reponame">'+e.full_name+'</span>\
                           <i class="glyphicon glyphicon-chevron-right"></i>\
                           </a>\
                           ');
      });
      $('.repo').click(function () {
        $('#backbutton').fadeIn();

        $('.1').attr('class', 'col-md-3 col-md-offset-0 fade-in shadow-box 1 hidden');
        $('.2').attr('class', 'col-md-3 col-md-offset-0 fade-in 2 out');
        $('.3').attr('class', 'col-md-4 col-md-offset-4 fade-in shadow-box 3');
        var repoName = $(this).children(".reponame").text();

        $('.3h1').text(repoName.split('/')[1] + '\'s Commits');
        $('.3h3').text('All of yesterday\'s events from ' + repoName + '.');
        $('.events').html('\
              <div class="progress">\
                <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>\
              </div>\
              <p class="text-muted">We are getting all your repo\'s events now...</p>\
        ');


        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate()-1);

        $.ajax({
          type: 'GET',
          data: {
            until: yesterday.toISOString()
          },
          url: 'https://api.github.com/repos/' + repoName + '/commits',
          success: function (data) {
            $('.events').html('');
            console.log(data);
          }
        });
      });
    });
}

function focusChooser (n) {
  if (n == 1) $('#forwardbutton').fadeIn();

  $('#backbutton').fadeOut();

  localStorage.userInfo = JSON.stringify(userInfo);

  $('.1').attr('class', 'col-md-3 col-md-offset-0 fade-in 1 out');
  $('.2').attr('class', 'col-md-4 col-md-offset-4 fade-in shadow-box 2');
  $('.3').attr('class', 'col-md-3 col-md-offset-10 fade-in out 3');

  loadRepos();
}

$("#SI").click(function () {
  var ready = false;
  var message = 'Something went wrong.';

  var username = $('#inputEmail3').val();

  if (!username) message = 'You must supply your username.';
  else ready = true;

  if (ready) {
    userInfo = {
      username: username,
    };
    focusChooser(0);
  } else {
    $('.alert-danger').remove();
    $('.1').append('<div class="alert alert-danger" role="alert">'+ message +'</div>');
    $('.alert-danger').hide();
    $('.alert-danger').slideDown();
  }
});

$('#backbutton').click(function () {
  $(this).fadeOut();
  focusChooser(1);
});

$('#forwardbutton').click(function () {
  $(this).fadeOut();
  $('#backbutton').fadeIn();

  $('.1').attr('class', 'col-md-3 col-md-offset-0 fade-in shadow-box 1 hidden');
  $('.2').attr('class', 'col-md-3 col-md-offset-0 fade-in 2 out');
  $('.3').attr('class', 'col-md-4 col-md-offset-4 fade-in shadow-box 3');
});

$('#s').on('blur', function() {
  $('#help').slideUp();
  search = $(this).val();
  loadRepos();
});

$('#s').on('focus', function() {
  $('#help').slideDown();
});

$(document).on('scroll', function () { document.body.scrollLeft = 0; }); // turn off horizontal scrolling, so card effect will work correctly.
