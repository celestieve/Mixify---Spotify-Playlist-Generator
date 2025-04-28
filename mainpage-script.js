const { createApp } = Vue;

createApp({
  data() {
    return {
      genres: [
        { name: 'Pop', subgenres: ['Indie Pop', 'New Wave', 'k-pop', 'Pop-punk', 'Country Pop', 'Teen Pop'] },
        { name: 'Rock', subgenres: ['Alt Rock', 'Grunge', 'Blues Rock', 'Soft Rock', 'Metal', 'Classic Rock'] },
        { name: 'Jazz', subgenres: ['Blues', 'Funk', 'Dixieland', 'Soul Jazz', 'Bossa Nova', 'Bebop'] },
        { name: 'Indie', subgenres: ['Shoegaze', 'Slowcore', 'Indietronica', 'Chamber Pop', 'Emo', 'Chillwave'] },
        { name: 'Rap', subgenres: ['Drill', 'Trap', 'Hyphy', 'Conscious Rap', 'Boom-Bap', 'Alt Rap'] }
      ],
    };
  },
  methods: {
    selectSubgenre(subgenre) {
      console.log('Selected subgenre:', subgenre);
      localStorage.setItem('selectedGenre', subgenre);
    },
    goToGenerate() {
      const selectedGenre = localStorage.getItem('selectedGenre');
      if (!selectedGenre) {
        alert('Please select a subgenre first!');
      } else {
        location.href = 'generation.html';
      }
    },
    surpriseMe() {
      const allSubgenres = this.genres.flatMap(genre => genre.subgenres);
      const randomSubgenre = allSubgenres[Math.floor(Math.random() * allSubgenres.length)];
      console.log('Surprise! Randomly selected subgenre:', randomSubgenre);
      localStorage.setItem('selectedGenre', randomSubgenre);
      location.href = 'generation.html';
    }
  },
  mounted() {
    const particleClick = document.querySelector(".button-particle-click");
    if (particleClick) {
      particleClick.addEventListener("click", (e) => {
        e.preventDefault();
        particleClick.classList.add("animate");

        setTimeout(() => {
          particleClick.classList.remove("animate");
        }, 600);
      });
    }
  }
}).mount('#app');