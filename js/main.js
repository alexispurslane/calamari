var threads = {};
var userInfo = {};
var repos = [];
var sd = new Showdown.converter();
var search = '';
var yesterday = new Date();
yesterday.setDate(yesterday.getDate()-1);

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
    $('.username').html(userInfo.username);
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

      $.ajax({
        type: 'GET',
        data: {
          since: yesterday.toISOString()
        },
        url: 'https://api.github.com/repos/' + e.full_name + '/commits',
        success: function (data) {
          threads[e.full_name] = data;
          /*jshint multistr: true*/
          $('.repos').append('\
                             <a class="list-group-item repo fade-in-only">\
                             <span class="badge">'+data.length+'</span>\
                             <span class="reponame">'+e.full_name+'</span>\
                             <i class="glyphicon glyphicon-chevron-right"></i>\
                             </a>\
                             ');
        }
      });
    });
  });
}

$('.repos').on('click', '.repo', function () {
  $('#backbutton').fadeIn();

  $('.1').attr('class', 'col-md-3 col-md-offset-0 fade-in shadow-box 1 hidden');
  $('.2').attr('class', 'col-md-3 col-md-offset-0 fade-in 2 out');
  $('.3').attr('class', 'col-md-4 col-md-offset-4 fade-in shadow-box 3');
  var repoName = $(this).children(".reponame").text();

  $('.3h1').text(repoName.split('/')[1] + '\'s Commits');
  $('.3h3').text('All of yesterday\'s events from ' + repoName + '.');
          /*jshint multistr: true*/
  $('.events').html('\
        <div class="progress">\
          <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>\
        </div>\
        <p class="text-muted">We are getting all your repo\'s events now...</p>\
  ');

  $('.events').html('');
  threads[repoName].forEach(function (e) {
          /*jshint multistr: true*/
    $('.events').append('<li class="list-group-item">\
                      <img src="'+e.author.avatar_url+'" class="avatar"/>\
                      <br/>\
                      <h2 class="list-group-item-heading">'+e.commit.author.name+'</h2>\
                      <p class="list-group-item-text">'+sd.makeHtml(e.commit.message)+'</p>\
                      </li>');
  });
});


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
    $('.username').html(userInfo.username);
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

$('#fgme').click(function () { localStorage.clear(); });
