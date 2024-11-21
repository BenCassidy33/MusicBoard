import { playlists, createPlaylistElements } from "./script.js"
import { requestMusicData, getTempApiToken } from "./comms.js"

let TEMP_ACCESS_TOKEN = await (async () => {
    return getTempApiToken()
})()

//let inputField = document.getElementById("searchInput")

document.getElementById("searchInput").addEventListener("input", (e) => {
    calculateSimilartyScore(e.target.value)
})

let modal = document.getElementById("shareModalContainer")

async function updateSongResultLists(data) {
    if (!data) {
        return;
    }

    let similarSongs = document.getElementById("similarSongs")
    similarSongs.innerHTML = ""

    for (let songResult of data.splice(0, 4)) {
        let element = document.createElement("div")
        element.classList.add("simlarSong")

        element.innerHTML = `
            <div class="resultEntry">
                <p><b>${songResult["song_name"]}</b> by ${songResult["song_artist"]}</p>
                <img src="public/add.svg" class="addSongButton" id="addSongToPlaylistButton"/>
            </div>
        `

        similarSongs.appendChild(element)
    }
}

document.getElementById("songSearchInput").addEventListener("input", async (e) => {
    let data = await requestMusicData(TEMP_ACCESS_TOKEN, e.target.value)
    updateSongResultLists(data)
})

document.getElementById("closeModal").addEventListener("click", () => {
    modal.style.display = "none"
})

/**
  * @param {string} input
  */

function findSimilarSong(input) {
    console.log(input)
    if (input == "") {
        createPlaylistElements(playlists)
    }

    let found = []

    for (let playlist of playlists) {
        for (let song of playlist.songs) {
            if (song.title.toLowerCase().includes(input.trim().toLowerCase())) {
                found.push(playlist)
            }
        }
    }

    return found;
}

/**
    @param {string} input 
*/

function findSimilarPlaylist(input) {
    let foundPlaylists = []

    for (let playlist of playlists) {
        if (playlist.playlist_name.toLowerCase().includes(input.trim().toLowerCase())) {
            foundPlaylists.push(playlist)
        }
    }

    return foundPlaylists;
}

/**
    @param {string} input 
*/

function calculateSimilartyScore(input) {
    let found;

    if (input == "") {
        found = playlists

    } else if (input.startsWith("song:")) {
        input = input.replace("song:", "")

        if (!input == "") {
            found = findSimilarSong(input)
        } else {
            found = playlists
        }

    } else {
        found = findSimilarPlaylist(input)
    }

    createPlaylistElements(found)
}

