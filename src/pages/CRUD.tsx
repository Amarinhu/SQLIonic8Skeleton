import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react"
import { useEffect, useRef, useState } from "react"
import './CRUD.css'
import { refreshOutline, bugOutline, constructOutline, addCircleOutline, listOutline, trash, trashBin, refresh, refreshCircle, wifiOutline, bug, grid, addCircle, search, server, send, serverOutline } from "ionicons/icons";
import { mostraErro } from '../utils/funcoes';
import TesteController from '../Controller/TesteController';
import CriaBanco from "../components/criaBanco";

const CRUD: React.FC = () => {
    const [iniciadoDB, defIniciadoDB] = useState<boolean>(false)

    const [erro, defErro] = useState<Array<string>>([])
    const [erroNum, defErroNum] = useState<number>(0)
    const [sttsCor, defSttsCor] = useState<string>('red')

    const [resSql, defResSql] = useState<string>('')

    const [sqlInput, defSqlInput] = useState<string>('')

    const [mosSqlInput, defMosSqlInput] = useState(false)

    const testaErro = () => {
        defErroNum(atualErroNum => {
            const novoErroNum = ++atualErroNum
            mostraErro("Teste Erro " + novoErroNum, defErro)
            return novoErroNum
        })
    }

    const criarTabela = async () => {
        try {
            const sql =
                `CREATE TABLE IF NOT EXISTS Teste (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        );`
            await TesteController.execSQL(sql)

            defResSql('Tabela: ' + "'Teste' " + "criada com sucesso")
        } catch (e: any) {
            mostraErro(e.toString(), defErro)
        }
    }

    const deletaTabela = async () => {
        const sql = `DROP TABLE Teste`
        await TesteController.execSQL(sql)
    }

    const limparTabela = async () => {
        const sql = `DELETE FROM Teste`
        await TesteController.execSQL(sql)
    }

    const mostraTabela = async () => {
        const tabela = await TesteController.selectTeste();

        if (tabela && "values" in tabela && Array.isArray(tabela.values) && tabela.values.length > 0) {
            defResSql(JSON.stringify(tabela));
        } else {
            defResSql("Nenhum dado encontrado na tabela Teste.");
        }

        mudaSttsCor()
    };

    const inserirValor = async () => {
        const num1 = Math.floor((Math.random() * 9) + 1)
        const num2 = Math.floor((Math.random() * 9) + 1)
        const num3 = Math.floor((Math.random() * 9) + 1)
        const numeroFinal = `${num1}` + `${num2}` + `${num3}`

        const sql =
            `INSERT INTO Teste (nome) VALUES (?);`

        await TesteController.execSQL(sql, [numeroFinal])
    }

    const recPagina = () => {
        location.reload()
    }

    const comandoSQL = async (query: string) => {
        const resultado = await TesteController.execSQL(query)
        if (query.trim().toUpperCase().startsWith("SELECT")) {
            defResSql(JSON.stringify(resultado));
        } else {
            defResSql('Comando Executado')
        }
    }

    const iniciarDB = async () => {
        mudaSttsCor()
    }

    const mudaSttsCor = async () => {
        const iniDB = await TesteController.verificaIni()

        defSttsCor(() => {
            let novaAtualCor = ''
            if (iniDB == true) {
                novaAtualCor = "green"
            } else if (iniDB == false) {
                novaAtualCor = "red"
            }
            return novaAtualCor
        })

        defIniciadoDB(iniDB)
    }

    const capSQL = (evento: any) => {
        const valor = evento.detail.value
        defSqlInput(valor)
    }

    const alternaCampoSql = () => {
        if (mosSqlInput == true) {
            defMosSqlInput(false)
        } else {
            defMosSqlInput(true)
        }
    }


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar><IonTitle className="ion-text-center">Dev Tools</IonTitle></IonToolbar>
            </IonHeader>
            <IonContent>
                <IonTitle style={{ backgroundColor: sttsCor }} className="ion-text-center">
                    Acesso Banco: {iniciadoDB.toString()}
                </IonTitle>

                <CriaBanco />

                <div className="centerButtons">
                    <button onClick={recPagina} className="squareButton blackbg">
                        <img src={refreshCircle} />
                        <p>Reiniciar Pagina</p>
                    </button>

                    <button onClick={iniciarDB} className="squareButton blackbg">
                        <img src={wifiOutline} />
                        <p>Inicializa DB</p>
                    </button>

                    <button onClick={mostraTabela} className="squareButton blackbg">
                        <img src={search} />
                        <p>Mostra Tabela TST</p>
                    </button>
                </div>
                <div className="centerButtons">
                    <button onClick={criarTabela} className="squareButton warningbg">
                        <img src={constructOutline} />
                        <p>Criar Tabela Tst</p>
                    </button>

                    <button onClick={inserirValor} className="squareButton warningbg">
                        <img src={addCircle} />
                        <p>Inserção Teste</p>
                    </button>

                    <button onClick={limparTabela} className="squareButton warningbg">
                        <img src={trashBin} />
                        <p>Limpa Tabela TST</p>
                    </button>
                </div>
                <div className="centerButtons">
                    <button onClick={testaErro} className="squareButton dangerbg">
                        <img src={bug} />
                        <p>Erro Genérico</p>
                    </button>

                    <button onClick={deletaTabela} className="squareButton dangerbg">
                        <img src={trash} />
                        <p>Deleta Tabela TST</p>
                    </button>

                    <button onClick={alternaCampoSql} className="squareButton blackbg">
                        <img src={server} />
                        <p>Comando SQL</p>
                    </button>
                </div>

                <div className="centerButtons">
                    <button id="inicia-cria-banco" disabled className="squareButton disabledbg">
                        <img src={serverOutline} />
                        <p>(auto) Cria Banco</p>
                    </button>
                </div>

                {mosSqlInput && <IonItem>
                    <IonInput placeholder="Insira o comando SQL aqui" onIonInput={(e) => capSQL(e)}></IonInput>
                    <IonButton onClick={() => comandoSQL(sqlInput)}><IonIcon icon={send} /></IonButton>
                </IonItem>}

                <div style={{ borderBottom: "white dotted 4px" }} className="consoleStyleAlt">
                    <div className="ion-text-center">
                        <IonText>Retorno SQL:</IonText>
                    </div>
                    <IonText>
                        {`>> ` + resSql}
                    </IonText>
                </div>

                <div style={{ paddingTop: "10px" }} className="consoleStyle">
                    <div className="ion-text-center">
                        <IonText>Erros Console (max 20):</IonText>
                    </div>
                    <IonText>
                        {erro.map((membro, key) => (
                            <p key={key} style={{ margin: "0" }}>{`>> ` + membro}</p>
                        ))}
                    </IonText>
                </div>
            </IonContent>

        </IonPage>
    )
}

export default CRUD