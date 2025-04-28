const { createApp } = Vue;

createApp({
  data() {
    return {
      songs: []
    }
  },
  async mounted() {
    const genre = localStorage.getItem('selectedGenre');
    if (!genre) {
      console.error('No genre selected.');
      return;
    }

    try {
      console.log(`Fetching songs for genre: ${genre}`);
      const response = await fetch(`http://localhost:8888/api/search/tracks?genre=${genre}`);
      const data = await response.json();
      console.log('Fetched data:', data);

      // Process and save into songs list
      this.songs = data.map(song => ({
        id: song.id,
        title: song.name,
        artist: song.artists.join(', '),
        albumName: song.album,
        albumArt: song.albumArt,
        previewUrl: song.previewUrl       }));

    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  }
}).mount('#app');