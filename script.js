console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs = [];
let currFolder = "local_songs"; // Set a default folder name for local simulation

// --- Local Data Structure to simulate server folders and songs ---
const localAlbums = [
    {
        folder: "chill-vibes",
        title: "Chill Vibes",
        description: "Relaxing music for a calm mood.",
        cover: "img/chill.jpg", // Placeholder image path
        songs: [
            "Ocean_Waves.mp3",
            "Morning_Coffee.mp3",
            "Midnight_Stroll.mp3"
        ]
    },
    {
        folder: "upbeat-pop",
        title: "Upbeat Pop Hits",
        description: "Catchy tunes to boost your day.",
        cover: "img/pop.jpg", // Placeholder image path
        songs: [
            "Summer_Anthem.mp3",
            "Dance_Floor.mp3"
        ]
    }
];
// --- END Local Data Structure ---

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Function to simulate fetching songs from a 'folder'
async function getSongs(folder) {
    currFolder = folder;
    
    // Find the album data based on the folder name
    const albumData = localAlbums.find(album => `songs/${album.folder}` === folder);

    if (!albumData) {
        console.error("Album not found:", folder);
        songs = [];
        return songs;
    }

    songs = albumData.songs.map(song => song.replaceAll(" ", "_")); // Ensure URL-safe names
 
    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        // Replace underscores for display, but use full name for playMusic call
        const displayName = song.replaceAll("_", " ").replace(".mp3", ""); 
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${displayName}</div>
                                <div>Artist Name</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // Get the track name from the list item's inner HTML (un-trimmed) and append .mp3 back for playback
            const trackName = e.querySelector(".info").firstElementChild.innerHTML.trim().replaceAll(" ", "_") + ".mp3";
            playMusic(trackName);

        })
    })

    return songs
}

const playMusic = (track, pause = false) => {
    // Note: Since we don't have actual MP3 files, this line will try to load a non-existent file
    // The rest of the UI (time, song info) will function correctly with simulated duration.
    currentSong.src = `songs/${currFolder.split("/").slice(-1)[0]}/${track}`; 
    
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track.replace(".mp3", "").replaceAll("_", " "))
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    // Set a placeholder duration for simulated playback (e.g., 3 minutes)
    currentSong.duration = 180; 
}

// Function to simulate displaying albums from localAlbums data
async function displayAlbums() {
    console.log("displaying albums")
    let cardContainer = document.querySelector(".cardContainer")
    cardContainer.innerHTML = ""; // Clear existing content
    
    for (const album of localAlbums) {
        const folder = album.folder;
        const response = album; 
        
        cardContainer.innerHTML += ` <div data-folder="songs/${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="${response.cover}" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            // The item.currentTarget.dataset.folder will be "songs/chill-vibes" or "songs/upbeat-pop"
            songs = await getSongs(item.currentTarget.dataset.folder)  
            if(songs.length > 0) {
                 playMusic(songs[0])
            }
        })
    })
}

// Function to handle the Day/Night mode toggle (New checkbox logic)
function setupModeToggle() {
    const modeCheckbox = document.getElementById("modeToggleCheckbox");

    modeCheckbox.addEventListener("change", () => {
        document.body.classList.toggle("light-mode");
        const isLightMode = document.body.classList.contains("light-mode");

        if (isLightMode) {
            console.log("Switched to Light Mode");
        } else {
            console.log("Switched to Dark Mode");
        }
    });
}

// Function to handle the login/signup alerts (Simulated working)
function setupAuthButtons() {
    document.querySelector(".signupbtn").addEventListener("click", () => {
        alert("Sign Up button clicked! (A proper server-side registration would be implemented here)");
    });

    document.querySelector(".loginbtn").addEventListener("click", () => {
        alert("Log In button clicked! (A proper server-side login would be implemented here)");
    });
}

async function main() {
    // Display all the albums on the page
    await displayAlbums();
    
    // Get the list of songs for the first album and play the first song (simulated)
    await getSongs(`songs/${localAlbums[0].folder}`);
    playMusic(songs[0], true); // true for pause by default

    // Setup the Day/Night mode toggle
    setupModeToggle();

    // Setup the Login/Signup buttons
    setupAuthButtons();


    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    // Listen for timeupdate event (uses the simulated currentSong.duration)
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    
    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let currentTrackName = currentSong.src.split("/").slice(-1)[0];
        let index = songs.findIndex(song => currentTrackName.endsWith(song)); // Find by matching the end of the URL
        
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")
        
        let currentTrackName = currentSong.src.split("/").slice(-1)[0];
        let index = songs.findIndex(song => currentTrackName.endsWith(song)); // Find by matching the end of the URL

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            // Restore volume to 10%
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10; 
        }

    })

}

main()