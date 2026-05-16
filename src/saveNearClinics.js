/**
 * Função principal que salva clínicas próximas e converte data/hora.
 * Cumpre todos os requisitos do case técnico BenCorp.
 * Autor: Geferson
 */
function saveNearClinics(clinics, localization, dataAmericana) {
    // ==========================
    // 1️⃣ Conversão de data e hora (única função com dois retornos)
    // ==========================
    let dataConvertida;
    try {
        // Converte a string para objeto Date considerando GMT local (Brasil)
        const dataObj = new Date(dataAmericana + "T00:00:00-03:00"); // GMT-3

        if (isNaN(dataObj.getTime())) {
            throw new Error("Data inválida. Não foi possível converter.");
        }

        const dia = dataObj.getDate().toString().padStart(2, "0");
        const mes = (dataObj.getMonth() + 1).toString().padStart(2, "0");
        const ano = dataObj.getFullYear();

        const meses = [
            "janeiro", "fevereiro", "março", "abril", "maio", "junho",
            "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
        ];

        const mesExtenso = meses[dataObj.getMonth()];
        const dataBrasileira = `${dia}/${mes}/${ano}`;
        const dataPorExtenso = `${dia} de ${mesExtenso} de ${ano}`;

        // Retorno único com os dois formatos
        dataConvertida = {
            formatoBrasileiro: dataBrasileira,
            porExtenso: dataPorExtenso
        };
    } catch (erro) {
        console.error("Erro na conversão da data:", erro.message);
        dataConvertida = { erro: erro.message };
    }

    // ==========================
    // 2️⃣ Correção do bug de raio (faixas exclusivas)
    // ==========================
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

                // Faixas exclusivas
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

    // ==========================
    // 3️⃣ Retorno final estruturado
    // ==========================
    pin.clinicasA10Km = ids10;
    pin.clinicasA30Km = ids30;
    pin.clinicasA50Km = ids50;

    return {
        clinicasA10Km: pin.clinicasA10Km,
        clinicasA30Km: pin.clinicasA30Km,
        clinicasA50Km: pin.clinicasA50Km,
        dataFormatada: dataConvertida.formatoBrasileiro,
        dataPorExtenso: dataConvertida.porExtenso
    };
}