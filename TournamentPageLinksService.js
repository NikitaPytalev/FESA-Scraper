const axios = require('axios');
const cheerio = require('cheerio');

const domain = 'http://www.shogi.net/fesa/';
const tournamentListPage = 'http://www.shogi.net/fesa/index.php?mid=4&dateid=Fall+2002';

async function getTournamentPageLinks()
{
    console.log(`Fetching tournament page links from: ${tournamentListPage}`)

    const response = await axios.get(tournamentListPage);
    const html = response.data;
    let $ = cheerio.load(html);

    const linksSelector = '#menu > p > a:not(:nth-last-child(1)):not(:nth-last-child(2))';
    const seasonLinks = $(linksSelector).toArray().map(node => {
        return domain + $(node).attr('href')
    });

    const showAllSelector = '#content > h3 > a';
    const tournamentResultsSeasonList = [];
    for(let seasonLink of seasonLinks) {
        const response = await axios.get(seasonLink);
        const html = response.data;
        const $ = cheerio.load(html);
        tournamentResultsSeasonList.push(domain + $(showAllSelector).attr('href'));    
    }

    return tournamentResultsSeasonList;
}

module.exports.getTournamentPageLinks = getTournamentPageLinks;
