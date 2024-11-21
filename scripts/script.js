import data from "../data/data.js"
import { getTempApiToken, requestMusicData } from "./comms.js";

const TEMP_USER_ID = crypto.randomUUID()

const playlistSidebar = document.getElementById("playlistSidebar")
const contentSection = document.getElementById("contentSection")
export let playlists = data["playlists"];
let songsListLastId = 0

export function createPlaylistElements(playlists) {
    if (!playlists) {
        console.error("Could not load playlists, please try again., please try again.")
        return;
    }

    if (document.getElementById(songsListLastId)) {
        playlistSidebar.removeChild(document.getElementById(songsListLastId))
    }

    let songsList = document.createElement("div")
    songsList.classList.add("songsList")
    songsList.id = songsListLastId = crypto.randomUUID()

    for (const playlist of playlists) {
        let element = document.createElement("div")

        element.innerHTML = `
            <div class="playlistElement" id="playlistElement${playlist.playlistID}">
                <img src="${playlist.playlist_art}" class="playlistCover">
                <div class="playlistInfo">
                    <p class="playlistText">
                        ${playlist.playlist_name}
                        ${playlist.playlist_creator}
                    </p>
                </div>
            </div>
        `

        element.addEventListener("click", function() {
            createPlaylistSongsVisual(`${playlist.playlistID}`)
        })


        songsList.appendChild(element)
    }

    playlistSidebar.appendChild(songsList)
}

function changeLikes(playlistID) {

    let playlistData = playlists[playlistID]
    let likeCountElement = document.getElementById("likeCount")

    if (!Object.hasOwn(playlistData, "likes")) {
        playlistData["likes"] = [TEMP_USER_ID]
        playlistData.likeCount += 1;
    } else if (playlistData["likes"].includes(TEMP_USER_ID)) {

        playlistData["likes"].splice(playlistData["likes"].indexOf(TEMP_USER_ID), 1)

        playlistData.likeCount -= 1;
    } else {
        playlistData["likes"].push(TEMP_USER_ID)
        playlistData.likeCount += 1;
    }

    likeCountElement.innerHTML = `${playlistData["likes"].length}`
    console.log(playlistData, typeof playlistData["likes"], playlistData["likes"].length)

}

function createPlaylistSongsVisual(playlistID) {
    const playlistData = playlists[playlistID]

    let songListHtml = ``

    for (let i = 0; i < playlistData.songs.length; i++) {
        let songInfo = playlistData.songs[i]
        songListHtml += `
        <div class="playlistSong">
            <img src="${songInfo.cover_art}">
            <div class="songInfo">
                <p>${songInfo.title} by ${songInfo.artist} (${songInfo.album})</p> 
            </div>
        </div>
        `
    }

    contentSection.innerHTML = `
        <div class="playlistContentSection">
            <div class="playlistInfoSection">
                <img src="${playlistData.playlist_art}">
                <div class="playlistInfo">
                    <h1>${playlistData.playlist_name}</h1>
                    <h3 style="margin-top: -1%">${playlistData.playlist_creator}</h3>
                    <div class="likeContainer" id="likeContainer"> 
                        <img src="public/like.svg" class="likeButton" id="likeButton"> 
                        <div id="likeCount">${playlistData.likeCount}</div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <img src="public/shuffle.svg" class="shuffleButton" id="shuffleSongs">
                        <img src="public/share.svg" class="shareButton" id="sharePlaylist">
                        <img src="public/add.svg" class="addButton" id="addSongButton">
                    </div>
                </div>
            </div>

            <div id="playlistSongs" class="playlistSongs"></div>
        </div>
        `


    document.getElementById("playlistSongs").innerHTML = songListHtml
    addEventListeners(playlistID)

    document.getElementById("likeContainer").addEventListener("click", () => {
        changeLikes(playlistID)
    })

}

function addEventListeners(playlistID) {
    document.getElementById("shuffleSongs").addEventListener("click", () => {
        randomizePlaylistSongOrder(playlistID)
    })

    document.getElementById("sharePlaylist").addEventListener("click", () => {
        document.getElementById("shareModalContainer").style.display = "flex"

        let sharePlaylistUrl = window.location.origin + '&sharePlaylistContent=' + JSON.stringify(playlists[playlistID])

        let shareUrl = document.getElementById("shareUrl");
        shareUrl.innerText = sharePlaylistUrl;

        document.getElementById("copyButton").addEventListener("click", () => {
            navigator.clipboard.writeText(sharePlaylistUrl)
        })
    })

    document.getElementById("addSongButton").addEventListener("click", () => {
        document.getElementById("findSongModalContainer").style.display = "flex"
    })

}


function randomizePlaylistSongOrder(playlistID) {
    let songs = playlists[playlistID].songs

    for (let i = 0; i < songs.length; i++) {
        let randomIdx = Math.floor(Math.random() * songs.length);
        let song = songs[i];
        songs[i] = songs[randomIdx];
        songs[randomIdx] = song;
    }

    playlists[playlistID].songs = songs
    createPlaylistSongsVisual(playlistID)
}

createPlaylistElements(playlists)
