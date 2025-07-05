const fs = require('fs');
const fetch = require('node-fetch');

const filePath = './pokehotspots.json';
const pokeData = require(filePath);

async function enrichWithStatsOnly() {
    for (const entry of pokeData.pokemon_entries) {
        const id = entry.entry_number;
        const statsUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
        console.log(`Fetching stats for Pokémon #${id}`);

        try {
            const response = await fetch(statsUrl);
            const data = await response.json();

            const extractedStats = data.stats.map(stat => ({
                name: stat.stat.name,
                base_stat: stat.base_stat
            }));

            // Voeg 'stats' toe aan de bestaande 'pokemon_species'
            entry.pokemon_species.stats = extractedStats;

        } catch (err) {
            console.error(`❌ Failed to fetch stats for Pokémon #${id}:`, err.message);
        }
    }

    // Schrijf terug naar dezelfde file
    fs.writeFileSync(
        filePath,
        JSON.stringify(pokeData, null, 2)
    );

    console.log('✅ Done: stats toegevoegd aan bestaande JSON!');
}

enrichWithStatsOnly();
