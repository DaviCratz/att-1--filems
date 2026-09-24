const API_BASE_URL = "https://att-1-filmes.vercel.app";

const modalEditar = document.querySelector("#modal-editar");
const formEditar = document.querySelector("#form-editar");
const btnCancelar = document.querySelector("#btn-cancelar");

// 1. BUSCAR E RENDERIZAR FILMES
async function buscarFilmes() {
    try {
        const resposta = await fetch(API_BASE_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os filmes");
        }

        const filmes = await resposta.json();
        const sectionFilmes = document.querySelector(".filmes");
        sectionFilmes.innerHTML = "";

        filmes.forEach((filme) => {
            const id = filme._id || filme.id;

            // Escapa aspas simples nos textos para evitar erros de sintaxe no HTML
            const tituloEscapado = (filme.title || "").replace(/'/g, "\\'");
            const generoEscapado = (filme.gender || "").replace(/'/g, "\\'");

            sectionFilmes.innerHTML += `
                <div class="filme">
                    <h2>${filme.title}</h2>
                    <p><strong>Gênero:</strong> ${filme.gender}</p>
                    <p><strong>Duração:</strong> ${filme.duration} minutos</p>
                    <p><strong>Classificação indicativa:</strong> ${
                        filme.ageLimit > 0 ? filme.ageLimit + " anos" : "Livre"
                    }</p>

                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button onclick="abrirEdicao('${id}', '${tituloEscapado}', '${generoEscapado}', ${filme.duration}, ${filme.ageLimit})" style="background-color: #ffc107; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Editar</button>
                        <button onclick="deletarFilme('${id}')" style="background-color: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Apagar</button>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Erro:", error);
    }
}

// 2. APAGAR FILME (Corrigido para rota /delete/:id)
async function deletarFilme(id) {
    if (!confirm("Tem certeza que deseja apagar este filme?")) return;

    try {
        const resposta = await fetch(`${API_BASE_URL}/delete/${id}`, {
            method: "DELETE"
        });

        if (resposta.ok) {
            alert("Filme apagado com sucesso!");
            buscarFilmes();
        } else {
            const erro = await resposta.json().catch(() => null);
            alert(`Erro ao apagar: ${erro ? erro.message : "Não foi possível apagar o filme."}`);
        }
    } catch (error) {
        console.error("Erro na requisição DELETE:", error);
        alert("Erro de conexão ao tentar apagar.");
    }
}

// 3. ABRIR FORMULÁRIO DE EDIÇÃO
function abrirEdicao(id, title, gender, duration, ageLimit) {
    document.querySelector("#edit_id").value = id;
    document.querySelector("#edit_titulo").value = title;
    document.querySelector("#edit_genero").value = gender;
    document.querySelector("#edit_duracao").value = duration;
    document.querySelector("#edit_classificacao").value = ageLimit;

    modalEditar.showModal();
}

btnCancelar.addEventListener("click", () => {
    modalEditar.close();
});

// 4. SALVAR EDIÇÃO (Corrigido para rota /update/:id ou PUT /:id)
formEditar.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.querySelector("#edit_id").value;
    const filmeAtualizado = {
        title: document.querySelector("#edit_titulo").value,
        gender: document.querySelector("#edit_genero").value,
        duration: Number(document.querySelector("#edit_duracao").value),
        ageLimit: Number(document.querySelector("#edit_classificacao").value)
    };

    try {
        // Tenta a rota /update/:id (se a tua API usar /update/:id ou PUT /:id)
        let resposta = await fetch(`${API_BASE_URL}/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(filmeAtualizado)
        });

        // Caso a rota /update/ não exista, tenta enviar direto para /:id
        if (resposta.status === 404) {
            resposta = await fetch(`${API_BASE_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(filmeAtualizado)
            });
        }

        if (resposta.ok) {
            alert("Filme atualizado com sucesso!");
            modalEditar.close();
            buscarFilmes();
        } else {
            const erro = await resposta.json().catch(() => null);
            alert(`Erro ao atualizar: ${erro ? erro.message : "Verifique os dados enviados."}`);
        }
    } catch (error) {
        console.error("Erro na requisição PUT:", error);
        alert("Erro de conexão ao tentar atualizar.");
    }
});

buscarFilmes();