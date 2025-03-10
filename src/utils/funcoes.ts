export const mostraErro = (erroString: string, defErro: React.Dispatch<React.SetStateAction<Array<string>>>) => {
    defErro(atualErro => {
        return [erroString, ...atualErro.slice(0, 19)]
    })
    console.error(erroString)
}