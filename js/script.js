
document.addEventListener("DOMContentLoaded", () => {
    fetch("commentaire")
        .then(response => response.json())
        .then(comentaires => {
            const listeCommentaire = document.getElementById('liste-commentaire');
            comentaires.forEach(element => {
                const divCommentaire = document.createElement('div');
                divCommentaire.className = 'commentaires-item';

                const texteCommentaire = document.createElement('div');
                texteCommentaire.className = 'commentaires-text';
                const elementCommentaire = document.createElement('p');
                elementCommentaire.innerHTML = `<i class="fa-solid fa-quote-left"></i> ${element.message} <i class="fa-solid fa-quote-right"></i>`;
                texteCommentaire.appendChild(elementCommentaire);

                const imageCommentaire = document.createElement('div');
                imageCommentaire.className = 'profile';
                const image = document.createElement('img');
                image.src = '/profile.jpeg'; // Chemin relatif corrigé
                const nom = document.createElement('h5');
                nom.innerHTML = element.nom;
                const titre = document.createElement('h6');
                titre.textContent = "Écrivain";

                imageCommentaire.appendChild(image);
                imageCommentaire.appendChild(nom);
                imageCommentaire.appendChild(titre);

                divCommentaire.appendChild(texteCommentaire);
                divCommentaire.appendChild(imageCommentaire);

                listeCommentaire.appendChild(divCommentaire);
            });
        });

    const formCommentaire = document.getElementById('comment-form');
    formCommentaire.addEventListener('submit', function (e) {
        e.preventDefault();
        const nomentrer = document.getElementById('nom');
        const messageEntrer = document.getElementById('textarea');
        const nom = nomentrer.value;
        const message = messageEntrer.value;

        fetch('/ajouter-commentaire', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `nom=${encodeURIComponent(nom)}&message=${encodeURIComponent(message)}`,
        })
        .then(response => {
            if (response.ok) {
                nomentrer.value = "";
                messageEntrer.value = "";
                location.reload();
            }
        });
    });
});

