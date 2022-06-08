module.exports = {
    tituloBancario: {
        DigitoVerificador: function (campo, pesoInicial) {
            let algarismos = campo.split('').map( (algarismo) => parseInt(algarismo) )
    
            const multiplicadorPar = pesoInicial == 2 ? 2 : 1
            const multiplicadorImpar = pesoInicial == 2 ? 1 : 2
    
            let algarismosMultiplicados = algarismos.map( (algarismo, posicao) => {
                let multiplicacao = posicao % 2 == 0 ? algarismo * multiplicadorPar : algarismo * multiplicadorImpar
    
                if(multiplicacao > 9) multiplicacao = parseInt( multiplicacao.toString()[0] ) + parseInt( multiplicacao.toString()[1] ) 
    
                return multiplicacao;
            })
    
            const somaMultiplicacao = algarismosMultiplicados.reduce( (total, algarismo) => total + algarismo )
    
            const resto = somaMultiplicacao % 10
    
            const dezenaPosterior = (parseInt(somaMultiplicacao / 10) + 1) * 10
    
            const digitoVerificador = (dezenaPosterior - resto).toString()[1]
    
            return digitoVerificador;
        } ,

        DigitoVerificadorGeral: function (codigo) {
            codigo = codigo.split('').map((algarismo) => parseInt(algarismo))
            
            codigo.splice(4,1);
    
            codigo.reverse();
    
            let multiplicador = 2;
    
            const multiplicacoes = codigo.map( algarismo => {
                algarismo *= multiplicador;
                
                multiplicador = multiplicador + 1 == 10 ? 2 : multiplicador + 1
    
                return algarismo;
            })
    
            const soma = multiplicacoes.reduce( (total, algarismo) => total + algarismo )
    
            let digitoVerificador = 11 - ( soma % 11 )
    
            if( [0, 10, 11].includes(digitoVerificador) ) digitoVerificador = 1;
            
            return digitoVerificador.toString();
        } ,

        Vencimento: function (fatorVencimento) {
            const dataBase = new Date(1997, 9, 7 )

            dataBase.setDate( dataBase.getDate() + parseInt(fatorVencimento) )

            const validade = dataBase;

            const validadeDia = validade.getDate() > 9 ? validade.getDate() : `0${validade.getDate()}`;
            const validadeMes = validade.getMonth() + 1 > 9 ? validade.getMonth() + 1 : `0${validade.getMonth() + 1}`;
            const validadeAno = validade.getFullYear();

            return `${validadeAno}-${validadeMes}-${validadeDia}`
        }
    } ,

    concessionaria: {
        DigitoVerificador: function (campo) {
            let algarismos = campo.split('').map( (algarismo) => parseInt(algarismo) )

            let algarismosMultiplicados = algarismos.map( (algarismo, posicao) => {
                let multiplicacao = posicao % 2 == 0 ? algarismo * 2 : algarismo * 1

                if(multiplicacao > 9) multiplicacao = parseInt( multiplicacao.toString()[0] ) + parseInt( multiplicacao.toString()[1] ) 

                return multiplicacao;
            })

            const somaMultiplicacao = algarismosMultiplicados.reduce( (total, algarismo) => total + algarismo )

            const resto = somaMultiplicacao % 10

            const digitoVerificador = resto == 0 ? '0' : (10 - resto).toString();

            return digitoVerificador;
        }
    }
}