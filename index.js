/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
        if (games.length == 0) {
            let noGamesFound = document.createElement('h2');
            noGamesFound.innerText = "NO GAMES FOUND!";
            gamesContainer.appendChild(noGamesFound);
        }
    // loop over each item in the data
        for (let i = 0; i < games.length; i++) {

        // create a new div element, which will become the game card
            let newGame = document.createElement("div");

        // add the class game-card to the list
            newGame.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
            newGame.innerHTML = `
            <img class="game-img" src=${games[i].img} />
            <h2>${games[i].name}</h2>
            <p>${games[i].description}</p>
            <div class="progressBar">
                <div class="totalProgress" style="width:${games[i].pledged / games[i].goal * 100}%">
                    $${games[i].pledged.toLocaleString()}&nbsp;/&nbsp;$${games[i].goal.toLocaleString()}
                </div>
            </div>
            <p>Backers: ${games[i].backers}</p>
            `;

        // append the game to the games-container
            gamesContainer.appendChild(newGame);
        }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
let totalContributions = GAMES_JSON.reduce((sumBackers, game) => {return sumBackers + game.backers}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `<p>${totalContributions.toLocaleString('en-US')}</p>`

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
let totalRaised = GAMES_JSON.reduce((sumRaised, game) => {return sumRaised + game.pledged}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `<p>$${totalRaised.toLocaleString('en-US')}</p>`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `<p>${GAMES_JSON.length}</p>`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter((game) => { return game.pledged < game.goal;})

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
    // console.log(unfundedGames.length);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGames = GAMES_JSON.filter((game) => { return game.pledged >= game.goal;})

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
    // console.log(fundedGames.length);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly);
fundedBtn.addEventListener('click', filterFundedOnly);
allBtn.addEventListener('click', showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let numUnfunded = GAMES_JSON.filter((game) => { return game.pledged < game.goal;}).length

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalRaised.toLocaleString()} has been raised for ${GAMES_JSON.length} games. Current, ${numUnfunded} ${(numUnfunded==1) ? "game remains" : "games remain"} unfunded. We need your help to fund these amazing games! `;

// create a new DOM element containing the template string and append it to the description container
let newDescriptionString = document.createElement('p');
newDescriptionString.innerHTML = displayStr;
descriptionContainer.appendChild(newDescriptionString);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let [firstGame, secondGame, ...otherGames] = sortedGames;
let {name: topName, desc1, pledged: pl1, goal: goal1, bkrs1, img1} = firstGame; 
let {name: runnerUpName, desc2, pledged: pl2, goal: goal2, bkrs2, img2} = secondGame;

// create a new element to hold the name of the top pledge game, then append it to the correct element
let topPledgeGame = document.createElement('p');
topPledgeGame.innerHTML = `<p>${topName}</p> <p>$${pl1.toLocaleString()}&nbsp;/&nbsp;$${goal1.toLocaleString()}</p>`;
firstGameContainer.appendChild(topPledgeGame);

// do the same for the runner up item
let runnerPledgeGame = document.createElement('p');
runnerPledgeGame.innerHTML = `<p>${runnerUpName}</p> <p>$${pl2.toLocaleString()}&nbsp;/&nbsp;$${goal2.toLocaleString()}</p>`;
secondGameContainer.appendChild(runnerPledgeGame);


/************************************************************
 * BONUS
 * Search Function
 */

// search
const searchBtn = document.getElementById("searchButton");
let searchInput = document.getElementById("searchGame");

function searchForGame() {    
    let filterSearch = GAMES_JSON.filter((game) => { return game.name.toLowerCase().includes(searchInput.value);})
    deleteChildElements(gamesContainer);
    addGamesToPage(filterSearch);
}

searchBtn.addEventListener('click', searchForGame);

// when pressing enter key, simulate a button press and search for input
searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchBtn.click();
    }
});