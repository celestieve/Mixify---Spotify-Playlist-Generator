const particleClick = document.querySelector(".button-particle-click");

particleClick.addEventListener("click", (e) => {
    e.preventDefault();
    particleClick.classList.add("animate")

    setTimeout(() => {
        particleClick.classList.remove("animate")
    }, 600)
} )

const { createApp } = Vue;

createApp({
    data() {
        return {
            genres: [
                { name: 'Pop', subgenres: ['Indie Pop', 'New Wave', 'Kpop', 'Pop-punk', 'Country Pop', 'Teen Pop'] },
                { name: 'Rock', subgenres: ['Alt Rock', 'Grunge', 'Blues Rock', 'Soft Rock', 'Metal', 'Classic Rock'] },
                { name: 'Jazz', subgenres: ['Blues', 'Funk', 'Dixieland', 'Soul Jazz', 'Bossa Nova', 'Bepop'] },
                { name: 'Indie', subgenres: ['Shoegaze', 'Slowcore', 'Indietronica', 'Chamber Pop', 'Emo', 'Chillwave'] },
                {name: 'Rap', subgenres: ['Drill', 'Trap', 'Hyphy', 'Consciious Rap', 'Boom-Bap', 'Alt Rap']}
            ]
        }
    }
}).mount('#app');
