/*
spotifyClientId="fd2a01bba130484e864a30c905e6c163"
spotifyClientSecret="3c4d25d662a2474bab5f4279d00d3ba9"
    */

/**
    @returns {string}
*/

export async function getTempApiToken() {
    const spotifyClientId = "fd2a01bba130484e864a30c905e6c163";
    const spotifyClientSecret = "3c4d25d662a2474bab5f4279d00d3ba9";

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: spotifyClientId,
                client_secret: spotifyClientSecret,
            }),
        });

        if (!response.ok) {
            console.error("Failed to fetch token:", response);
            return null;
        }

        const data = await response.json();
        return data["access_token"]; // Return the token
    } catch (error) {
        console.error("Error fetching token:", error);
        return null;
    }
}

/**
    @param {string} input 
    @returns {}
*/

export async function requestMusicData(token, requestedSongData) {
    const REQUEST_SONG_URL = `https://api.spotify.com/v1/search?q=${encodeURIComponent(requestedSongData)}&type=track`

    try {
        const res = await fetch(REQUEST_SONG_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            console.warn("Could not find song (likely due to empty song search inputs). Debug Data: ", requestedSongData, res)
            return null;
        }

        const data = await res.json()
        return parseSongData(data)
    } catch (error) {
        console.error("Error fetching song data: ", error)
        return null
    }
}



function parseSongData(songData) {
    let parsedSongData = []
    for (let entry of songData["tracks"]["items"]) {
        parsedSongData.push({
            song_name: entry["name"],
            song_artist: entry["artists"][0]["name"],
        })
    }


    return parsedSongData
}

/**
* @typedef {Object} songResults
* @param {Object} songResults 
*/

