const particleClick = document.querySelector(".button-particle-click");

particleClick.addEventListener("click", (e) => {
    e.preventDefault();
    particleClick.classList.add("animate")

    setTimeout(() => {
        particleClick.classList.remove("animate")
    }, 600)
} )