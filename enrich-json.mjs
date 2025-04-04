import fs from 'fs/promises';
import fetch from 'node-fetch';

const filePath = './pokehotspots.json'; // pas aan indien nodig

async function enrichPokemonData() {
    const rawData = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(rawData);

    const enrichedEntries = [];

    for (const entry of jsonData.pokemon_entries) {
        const id = entry.entry_number;
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();

            const types = data.types.map(t => t.type.name);
            const height = data.height;
            const weight = data.weight;

            enrichedEntries.push({
                ...entry,
                types,
                height,
                weight,
            });

            console.log(`✅ Verrijkt: ${entry.pokemon_species.name}`);
        } catch (error) {
            console.error(`❌ Fout bij ${entry.pokemon_species.name}:`, error);
            enrichedEntries.push(entry); // fallback
        }
    }

    const enrichedJson = {
        ...jsonData,
        pokemon_entries: enrichedEntries,
    };

    await fs.writeFile(filePath, JSON.stringify(enrichedJson, null, 2));
    console.log('🎉 JSON verrijkt en opgeslagen!');
}

enrichPokemonData();
