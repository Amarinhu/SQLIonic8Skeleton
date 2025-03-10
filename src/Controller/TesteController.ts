import Database from '../services/database';

export class TesteController {
    execSQL = async (sql: string, valores?: string[]) => {
      return await Database.execSQL(sql, valores);
    };

    selectTeste = async () => {
      return await Database.execSQL("SELECT * FROM TESTE")
    }

    verificaIni = async () => {
      return await Database.iniciaDB()
    }
}

export default new TesteController