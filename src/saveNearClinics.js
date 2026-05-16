/**
 * Função principal que salva clínicas próximas e converte data/hora.
 * Autor: Geferson Salacinski
 */
function saveNearClinics(clinics, localization, dataAmericana) {
    // 1️⃣ Conversão de data e hora (única função com dois retornos)
    let dataConvertida;
    try {
        // Converte a string para objeto Date usando meia-noite em GMT-3,
        // para preservar a mesma data no fuso America/Sao_Paulo.
        const parsed = new Date(dataAmericana + "T00:00:00-03:00");

        if (isNaN(parsed.getTime())) {
            throw new Error("Data inválida. Não foi possível converter.");
        }

        const optionsShort = { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric' };
        const optionsLong = { timeZone: 'America/Sao_Paulo', day: '2-digit', month: 'long', year: 'numeric' };

        const dataBrasileira = new Intl.DateTimeFormat('pt-BR', optionsShort).format(parsed);
        const dataPorExtenso = new Intl.DateTimeFormat('pt-BR', optionsLong).format(parsed);

        dataConvertida = {
            formatoBrasileiro: dataBrasileira,
            porExtenso: dataPorExtenso
        };
    } catch (erro) {
        console.error("Erro na conversão da data:", erro.message);
        dataConvertida = { erro: erro.message };
    }

    
    // 2️⃣ Correção do bug de raio (faixas exclusivas)
    // para corigir o erro, adicionei o else if para especificar a busca, assim ele vai buscar em uma distancia maior que 10km ate 30km e maior que 30km ate 50km.
    let ids10 = [];
    let ids30 = [];
    let ids50 = [];

    clinics.forEach(hit => {
        try {
            const clinic = br.com.bencorp.prestador.Clinica_get({ "_id": hit.clinica._id });

            if (
                clinic.empresaPessoa &&
                clinic.empresaPessoa.addresses &&
                clinic.empresaPessoa.addresses.length > 0 &&
                clinic.empresaPessoa.addresses[0].coordinates &&
                localization &&
                localization.coordinates
            ) {
                const distancia = distanceInKM(localization.coordinates, clinic.empresaPessoa.addresses[0].coordinates);

                const infoClinica = {
                    codigoSoc: clinic.codigoNoSOC,
                    id: clinic._id,
                    tipoDeAtendimento: clinic.informacoesDeAtendimento.tipoDoAtendimento,
                    pagamentoAntecipado: clinic.informacoesDeAtendimento.pagamentoAntecipado,
                    dataFormatada: dataConvertida.formatoBrasileiro,
                    dataPorExtenso: dataConvertida.porExtenso
                };

                // Foi criado uma faixa para cada tipo de busca, garantindo que cada clínica seja categorizada em apenas uma faixa de distância, 10km, 30km ou 50km. Assim, evitamos que uma clínica seja listada em múltiplas faixas, o que poderia ocorrer com a lógica anterior. Com essa abordagem, cada clínica será avaliada e classificada de forma clara e precisa, garantindo uma organização mais eficiente dos resultados. resolve o problema de clínicas aparecerem em múltiplas faixas de distância, garantindo que cada clínica seja listada apenas na faixa correspondente à sua distância real do ponto de referência.
                if (distancia <= 10) {
                    ids10.push(infoClinica);
                } else if (distancia > 10 && distancia <= 30) {
                    ids30.push(infoClinica);
                } else if (distancia > 30 && distancia <= 50) {
                    ids50.push(infoClinica);
                }
            }
        } catch (e) {
            console.error("Erro ao processar clínica:", e);
        }
    });

    // 3️⃣ Retorno final estruturado
    // Aqui mostra o retorno final da função, com as clínicas organizadas por distância e as datas formatadas.
    return {
        clinicasA10Km: ids10,
        clinicasA30Km: ids30,
        clinicasA50Km: ids50,
        dataFormatada: dataConvertida.formatoBrasileiro,
        dataPorExtenso: dataConvertida.porExtenso
    };
}

module.exports = saveNearClinics;
