var threads = {};

$("#SI").click(function () {
  $('.1').attr('class', 'col-md-3 col-md-offset-0 fade-in shadow-box 1 out');
  $('.2').attr('class', 'col-md-4 col-md-offset-4 fade-in shadow-box 2');
});

$('a.list-group-item').click(function () {
  var repoName = $(this).children(".reponame").text();
  $.ajax('https://api.github.com/repos/' + repoName).then(function (d) {
    $.ajax(d.events_url).then(function (d) {
      var issues_covered = [];

      d.forEach(function (e) {
        console.log(e);
        if (e.type == "IssueCommentEvent") {
          if (issues_covered.indexOf(e.id) != -1) {
            threads[e.id].push(e.payload.comment.body);
          } else {
            issues_covered.push(e.id);
            threads[e.id] = [e.payload.body];
          }
        }
      });
    });
  });
});
