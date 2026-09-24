const formFilme = document.querySelector("#form-filme");

async function cadastrarFilme(event) {
    event.preventDefault();

    const novoFilme = {
        title: document.querySelector("#titulo_filme").value,
        gender: document.querySelector("#genero").value,
        duration: Number(document.querySelector("#duracao").value),
        ageLimit: Number(document.querySelector("#classificacao_etaria").value)
    };

    try {
        const resposta = await fetch("https://att-1-filmes.vercel.app/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoFilme)
        });

        if (resposta.ok) {
            alert("Filme cadastrado com sucesso!");
            window.location.href = "../index.html";
        } else {
            const erro = await resposta.json().catch(() => null);
            alert(`Erro ao cadastrar: ${erro ? erro.message : "Verifique os dados enviados."}`);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão com o servidor.");
    }
}

formFilme.addEventListener("submit", cadastrarFilme);