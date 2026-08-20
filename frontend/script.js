async function buscarFilmes() {
    try {
        const resposta = await fetch("http://localhost:3333")

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os filmes")
        }

        const filmes = await resposta.json()

        const sectionFilmes = document.querySelector(".filmes")

        sectionFilmes.innerHTML = ""

        filmes.forEach((filme) => {
            sectionFilmes.innerHTML += `
                <div class="filme">
                    <h2>${filme.title}</h2>

                    <p>
                        <strong>Gênero:</strong>
                        ${filme.gender}
                    </p>

                    <p>
                        <strong>Duração:</strong>
                        ${filme.duration} minutos
                    </p>

                    <p>
                        <strong>Classificação indicativa:</strong>
                        ${filme.ageLimit > 0
                            ? filme.ageLimit + " anos"
                            : "Livre"}
                    </p>
                </div>
            `
        })
    } catch (error) {
        console.error("Erro:", error)
    }
}

buscarFilmes()
