const { getTournamentResults } = require('./TournamentResultsService');
const { getTournamentPageLinks } = require('./TournamentPageLinksService');

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

getTournamentsData().then(result => {
    console.log(result);
})