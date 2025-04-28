const { createApp } = Vue;

createApp({
    data() {
        return {
            songs: [
                // Placeholder example data (you can replace with actual API results)
                { id: 1, title: "Sunrise Drive", artist: "Lofi Beats", albumName:"", albumArt: "", previewUrl: "https://example.com/song1.mp3" },
                { id: 2, title: "Moonlight Mood", artist: "Chillhop Artist", albumName:"", albumArt: "", previewUrl: "https://example.com/song2.mp3" },
                { id: 3, title: "Night Vibes", artist: "Dreamy Synth", albumName:"", albumArt: "", previewUrl: "https://example.com/song3.mp3" }
            ]
        };
    }
}).mount("#app");
