import { IonLoading } from "@ionic/react"
import { useEffect, useState } from "react"
import TesteController from "../Controller/TesteController"

interface CriaBancoProps {
    mensagem: string,
    trigger: string
}

const CriaBanco: React.FC<CriaBancoProps> = ({ mensagem, trigger }) => {

    useEffect(() => {
        const criarBanco = async () => {
            try {
                const sql =
                    `CREATE TABLE IF NOT EXISTS Teste (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL
                );`

                await TesteController.execSQL(sql)
            } catch (e) { console.error(e) }
        }

        criarBanco()
    })

    return null
}

export default CriaBanco