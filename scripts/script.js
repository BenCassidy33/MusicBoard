import data from "../data/data.js"


const playlistSidebar = document.getElementById("playlistSidebar")
const contentSection = document.getElementById("contentSection")
export let playlists = data["playlists"];

let songsListLastId = 0

/**
 * @typedef {Object} Song
 * @property {number} songID - Unique identifier for the song.
 * @property {string} title - Title of the song.
 * @property {string} artist - Artist of the song.
 * @property {string} album - Album the song belongs to.
 * @property {string} cover_art - URL of the song's cover art.
 * @property {string} duration - Duration of the song in "mm:ss" format.
 */

/**
 * @typedef {Object} Playlist
 * @property {number} playlistID - Unique identifier for the playlist.
 * @property {string} playlist_name - Name of the playlist.
 * @property {string} playlist_creator - Name of the creator of the playlist.
 * @property {string} playlist_art - URL of the playlist's cover art.
 * @property {number} likeCount - Number of likes the playlist has received.
 * @property {Song[]} songs - Array of songs in the playlist.
 */

/**
 * @param {Playlist[]} playlists - Array of playlist objects.
 */

export function createPlaylistElements(playlists) {
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
                    <p>
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

function createPlaylistSongsVisual(playlistID) {
  const playlistData = playlists[playlistID]

  let songListHtml = ``

  console.log(playlistData.songs)

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
                    <h3>${playlistData.playlist_creator}</h3>
                    <p>Likes: ${playlistData.likeCount}</p>
                    <div style="display: flex; align-items: center;"> Songs: <img src="public/shuffle.svg" class="shuffleButton" id="shuffleSongs"></div>
                </div>
            </div>

            <div id="playlistSongs" class="playlistSongs"></div>
        </div>
        `

  document.getElementById("playlistSongs").innerHTML = songListHtml

  document.getElementById("shuffleSongs").addEventListener("click", () => {
    randomizePlaylistSongOrder(playlistID)
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

