import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
import { useRef } from "react";

class database {
    private db: SQLiteDBConnection | null = null;
    private sqlite: SQLiteConnection | null = null;
    private dbName = "crudDB";
    
    iniciaDB = async () => {
        if (this.sqlite) return true;

        this.sqlite = new SQLiteConnection(CapacitorSQLite);
        try {
            const consistencia = await this.sqlite.checkConnectionsConsistency();
            const verConsistencia = consistencia.result;
            const conexao = await this.sqlite.isConnection(this.dbName, false);
            const verConexao = conexao.result;

            if (verConexao && verConsistencia) {
                this.db = await this.sqlite.retrieveConnection(this.dbName, false);
            } else {
                this.db = await this.sqlite.createConnection(
                    this.dbName,
                    false,
                    "no-encryption",
                    1,
                    false
                );
            }
            return true;
        } catch (erro) {
            console.error("Erro inicializando DB: " + erro)
            return false;
        }
    }

    execSQL = async (query: string, valores: any[] = []) => {
        await this.iniciaDB();

        if (!this.db) {
            console.error("Banco de dados não inicializado");
            return null;
        }
        let resultado;
        try {
            if (!(await this.db.isDBOpen()).result) {
                await this.db.open();
            }

            if (query.trim().toUpperCase().startsWith("SELECT")) {
                resultado = await this.db.query(query, valores);
            } else {
                resultado = await this.db.run(query, valores);
            }
            return resultado;
        } catch (erro) {
            console.error("Erro ao executar SQL: " + erro);
            return null;
        } finally {
            if ((await this.db.isDBOpen()).result) {
                await this.db.close();
            }
        }
    };
}

export default new database();