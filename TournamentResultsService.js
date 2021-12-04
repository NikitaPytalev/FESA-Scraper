const axios = require('axios')
const cheerio = require('cheerio')

async function getTournamentResults(link)
{
    console.log(`Fetching tournament results from: ${link}`)

    const response = await axios.get(link)
    const html = response.data
    const $ = cheerio.load(html)
    
    const tables = $('#content > p:not(:last-child) > table'); // tables are inside paragraphs
    const rowsSelector = 'tbody > tr:not(:nth-child(1)):not(:nth-child(2))';
    
    const tournaments = [];
    for (const table of tables)
    {
        const nameWithDate = (cheerio.load(table))('h3').html().split('<br>');
        const name = nameWithDate[0];
        const date =  nameWithDate[1];
    
        const rowsHTML = (cheerio.load(table))(rowsSelector);
        const rows = convertToRowsObject($, rowsHTML);
    
        const tournament = {
            name: name,
            date: date,
            rows: rows,
            promotions: []
        }
    
        tournaments.push(tournament);
    }

    return tournaments;
}

function convertToRowsObject($, rowsHTML)
{
    const rows = [];

    for(let rowHTML of rowsHTML)
    {
        let test = (cheerio.load(rowHTML))('td:first-child').html();
        if((cheerio.load(rowHTML))('td:first-child').html() === '&nbsp;')
        {
            return rows;
        }

        const row = {
            id: (cheerio.load(rowHTML))('td:first-child').text(),
            firstName:  (cheerio.load(rowHTML))('td:nth-child(3) > a').text(),
            secondName:  (cheerio.load(rowHTML))('td:nth-child(2) > a').text(),
            country: (cheerio.load(rowHTML))('td:nth-child(4) > img').attr('title'),
            rank: (cheerio.load(rowHTML))('td:nth-child(5)').text(),
            rate: (cheerio.load(rowHTML))('td:nth-child(6)').text(),
            victoryPoints: (cheerio.load(rowHTML))('td:nth-last-child(2)').text(),
            rateChange: (cheerio.load(rowHTML))('td:last-child').text(),
        }

        const childrenCount = (cheerio.load(rowHTML))('td').length;

        for(let i = 7, roundNum = 1; i < childrenCount; i++, roundNum++)
        {
            row[`Round ${roundNum}`] = (cheerio.load(rowHTML))(`td:nth-child(${i})`).text();
        }

        rows.push(row);
    }

    return rows;
}

module.exports.getTournamentResults = getTournamentResults;
