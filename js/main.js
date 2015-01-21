var threads = {};
var userInfo = {};
var repos = [];

$("#SI").click(function () {
  var ready = false;
  var message = 'Something went wrong.';

  var email = $('#inputEmail3').val();
  var password = $('#inputPassword3').val();

  if (!email && !password) message = 'You must supply your email and password!';
  else if (!email) message = 'You must supply your email.';
  else if (!password) message = 'You must supply your password.';
  else ready = true;

  if (ready) {
    userInfo = {
      email: email,
      password: password,
      username: email.split("@")[0]
    };
    $('.1').attr('class', 'col-md-3 col-md-offset-0 fade-in 1 out');
    $('.2').attr('class', 'col-md-4 col-md-offset-4 fade-in shadow-box 2');
    $('.3').attr('class', 'col-md-3 col-md-offset-10 fade-in out 3');

    /*jshint multistr: true*/
    $('.repos').html('\
          <div class="progress">\
            <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>\
          </div>\
          <p class="text-muted">We are getting all your repos now...</p>\
    ');

    $.ajax('https://api.github.com/users/'+userInfo.username+'/subscriptions').then(function (d) {
      repos = d;
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
        $('.1').attr('class', 'col-md-3 col-md-offset-0 fade-in shadow-box 1 hidden');
        $('.2').attr('class', 'col-md-3 col-md-offset-0 fade-in 1 out');
        $('.3').attr('class', 'col-md-4 col-md-offset-4 fade-in shadow-box 2');
        var repoName = $(this).children(".reponame").text();

        $('.3h1').text(repoName.split('/')[1] + '\'s Events');
        $('.3h4').text('All of today\'s events from ' + repoName + '.');
        $('.events').html('\
              <div class="progress">\
                <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>\
              </div>\
              <p class="text-muted">We are getting all your repo\'s events now...</p>\
        ');

        $.ajax('https://api.github.com/repos/' + repoName).then(function (d) {
          $('.events').html('');
          $.ajax(d.events_url).then(function (data) {

          });
        });
      });
    });

  } else {
    $('.alert-danger').remove();
    $('.1').append('<div class="alert alert-danger" role="alert">'+ message +'</div>');
    $('.alert-danger').hide();
    $('.alert-danger').slideDown();
  }
});

