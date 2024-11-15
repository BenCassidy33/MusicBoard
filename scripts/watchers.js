import { playlists, createPlaylistElements } from "./script.js"

let inputField = document.getElementById("searchInput")

inputField.addEventListener("input", (event) => {
  calculateSimilartyScore(event.target.value)
})

/**
  * @param {string} input
  */

function calculateSimilartyScore(input) {
  if (input == "") {
    createPlaylistElements(playlists)
  }

  let scores = []

  for (let playlist of playlists) {
    if (playlist.playlist_name.toLowerCase().includes(input)) {
      console.table({
        playlist: playlist.playlist_name,
        input: input,
        matches: playlist.playlist_name.toLowerCase().includes(input)
      })
      scores.push(playlist)
    }
  }

  createPlaylistElements(scores)
}
