const { getTournamentResults } = require('./TournamentResultsService');
const { getTournamentPageLinks } = require('./TournamentPageLinksService');
const { mongoose } = require('mongoose');

async function start() {
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000', {
            useNewUrlParser: true,
            useFindAndModify: false
        })
    } catch (e) {
        console.log(e)
    }
}

start();

async function getTournamentsData()
{
    const tournamentPagelinks = await getTournamentPageLinks();
    let tournaments = [];
    for(tournamentPageLink of tournamentPagelinks)
    {
        const fetchedTournaments = await getTournamentResults(tournamentPageLink);
        tournaments.push(...fetchedTournaments);
    }

    return tournaments;
}
