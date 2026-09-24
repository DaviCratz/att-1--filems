import express from "express"
import mysql2 from "mysql2"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

const database = mysql2.createPool({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "alunos_filmes03MC"
})

// ============================
// BUSCAR FILMES
// ============================

app.get("/", (request, response) => {

    const selectCommand = `
        SELECT * FROM correcao_MarcioMarcal
    `

    database.query(selectCommand, (error, data) => {

        if (error) {

            console.log("Erro ao buscar filmes:", error)

            return response.status(500).json({
                message: "Erro ao buscar filmes"
            })
        }

        response.json(data)
    })
})

// ============================
// CADASTRAR FILME
// ============================

app.post("/create", (request, response) => {

    const {
        title,
        gender,
        ageLimit,
        duration
    } = request.body

    const insertCommand = `
        INSERT INTO correcao_MarcioMarcal
        (title, gender, ageLimit, duration)
        VALUES (?, ?, ?, ?)
    `

    database.query(
        insertCommand,
        [title, gender, ageLimit, duration],
        (error) => {

            if (error) {

                console.log("Erro ao cadastrar:", error)

                return response.status(500).json({
                    message: "Erro ao cadastrar filme"
                })
            }

            response.status(201).json({
                message: "Filme cadastrado com sucesso!"
            })
        }
    )
})

// ============================
// DELETAR FILME
// ============================

app.delete("/delete/:id", (request, response) => {

    const { id } = request.params

    const deleteCommand = `
        DELETE FROM correcao_MarcioMarcal
        WHERE id = ?
    `

    database.query(
        deleteCommand,
        [id],
        (error) => {

            if (error) {

                console.log("Erro ao apagar:", error)

                return response.status(500).json({
                    message: "Erro ao apagar filme"
                })
            }

            response.json({
                message: "Filme apagado com sucesso!"
            })
        }
    )
})

// ============================
// EDITAR FILME
// ============================

app.put("/update/:id", (request, response) => {

    const { id } = request.params

    const {
        title,
        gender,
        ageLimit,
        duration
    } = request.body

    const updateCommand = `
        UPDATE correcao_MarcioMarcal
        SET
            title = ?,
            gender = ?,
            ageLimit = ?,
            duration = ?
        WHERE id = ?
    `

    database.query(
        updateCommand,
        [
            title,
            gender,
            ageLimit,
            duration,
            id
        ],
        (error) => {

            if (error) {

                console.log("Erro ao editar:", error)

                return response.status(500).json({
                    message: "Erro ao editar filme"
                })
            }

            response.json({
                message: "Filme editado com sucesso!"
            })
        }
    )
})

// ============================
// SERVIDOR
// ============================

app.listen(3333, () => {

    console.log(
        "Servidor online em http://localhost:3333"
    )

})
