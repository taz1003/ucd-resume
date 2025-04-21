function userInformationHTML(user) {
  return `
      <h2>${user.name}
          <span class="small-name">
              (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
          </span>
      </h2>
      <div class="gh-content">
          <div class="gh-avatar">
              <a href="${user.html_url}" target="_blank">
                  <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
              </a>
          </div>
          <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p>
      </div>`;
}

function repoInformationHTML(repos) {
  if (repos.length == 0) {
    return `<div class="clearfix repo-list">No repos!</div>`;
  }

  var listItemsHTML = repos.map(function (repo) {
    return `<li>
                  <a href="${repo.html_url}" target="_blank">${repo.name}</a>
              </li>`;
  });

  return `<div class="clearfix repo-list">
              <p>
                  <strong>Repo List:</strong>
              </p>
              <ul>
                  ${listItemsHTML.join("\n")}
              </ul>
          </div>`;
}

function fetchGitHubInformation(event) {
  $("#gh-user-data").html("");
  $("#gh-repo-data").html("");

  var username = $("#gh-username").val();
  if (!username) {
    $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
    return;
  }

  $("#gh-user-data").html(
    `<div id="loader">
          <img src="assets/css/loader.gif" alt="loading..." />
      </div>`
  );

  $.when($.getJSON(`https://api.github.com/users/${username}`), $.getJSON(`https://api.github.com/users/${username}/repos`)).then(
    function (firstResponse, secondResponse) {
      var userData = firstResponse[0];
      var repoData = secondResponse[0];
      $("#gh-user-data").html(userInformationHTML(userData));
      $("#gh-repo-data").html(repoInformationHTML(repoData));
    },
    function (errorResponse) {
      if (errorResponse.status === 404) {
        $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);
      } else if (errorResponse.status === 403) {
        var resetTime = new Date(errorResponse.getResponseHeader("X-RateLimit-Reset") * 1000);
        $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
      } else {
        console.log(errorResponse);
        $("#gh-user-data").html(`<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
      }
    }
  );
}

$(document).ready(fetchGitHubInformation);
// repos is the object returned from the github Api
// github returns this object as an array of objects, so we can use the standard array method of .length to check if it is empty

// map is a method that takes an array and returns a new array with the results of calling
// a provided function on every element in the calling array. map() works like a forEach loop, but returns an array with
// the results of the function. It does not change the original array.

// <!-- join() method joins the elements of an array into a string, and returns the string. -->
//                 <!-- join() method takes an optional parameter, which is a separator. If no separator is specified,
//                   the elements are separated by a comma. -->
//                 <!-- This also stops us from having to iterate through
//                   the new array once again to create a string. -->
//                 <!-- join() method is a very useful method for converting an array into a string. -->
// when method packs them into arrays since there more than 1 responses. Line 65 and 66
// Each of the responses is an array with 3 elements: the data returned from the server, the status, and the jqXHR object. Line 67 and 68
