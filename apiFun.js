// api url and query
const url = "https://api.github.com/search/repositories";
let query = "";

// get the date in YYYY-MM-DD (Easter)
const getDate = () => {
  // get curr date and offset from UTC
  let date = new Date();
  let dateOffset = date.getTimezoneOffset();
  // correct date
  date = new Date(date.getTime() - dateOffset * 60 * 1000);
  // YYYY-MM-DD
  return date.toISOString().split("T")[0];
};

// get the repos; handles output
const getRepos = () => {
  // set up request and 'assert'
  let xhr = new XMLHttpRequest();
  if (!xhr) return;

  // onreadystatechange callback
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let responseJSON = JSON.parse(xhr.responseText);
      printResults(responseJSON.items);
    }
  };

  xhr.open("GET", url + query, true);
  xhr.send();
};

// print results
const printResults = (repos) => {
  let repoOutput = document.querySelector("#repo-output");
  repoOutput.innerHTML = "";
  if (!repos.length) {
    repoOutput.innerHTML = "<p>Sorry, no results for today :(</p>";
    return;
  }
  repos.forEach((repo) => {
    // output in card shape
    let repoCard = document.createElement("div");
    // build
    repoCard.className = "repo-card";
    repoCard.innerHTML = `<p><strong>Repo name:</strong> ${repo.name}</p><p><strong>Description:</strong> ${repo.description}</p>`;
    repoCard.innerHTML += `<p><strong>Author:</strong> ${repo.owner.login}</p><p><strong>Language</strong> ${repo.language}</p>`;
    repoCard.innerHTML += `<p><a href="https://github.com/${repo.full_name}"><strong>See it here</strong></a></p>`;
    // attach to root
    repoOutput.appendChild(repoCard);
  });
};

// execute user input
const search = () => {
  // get word
  let word = $("#input-word").val();
  // repos from today with word
  query = `?q=${encodeURIComponent(
    `created:${getDate()} ${word} in:name,description,readme`
  )}`;
  // get results
  getRepos();
};

// deal with submit i.e. if user presses enter key
$("#search-form").submit((e) => {
  e.preventDefault();
  search();
});
