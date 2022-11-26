const { pinata } = require("../pinata");

async function getAll(req, res) {
    try {
        let page = req.url.split("=")[1];
        let limit = req.url.split("=")[2];
        page = page.replace(/[^0-9]/g, '');
        limit = limit.replace(/[^0-9]/g, '');
        const conta = req.url.split("=")[3];
        console.log(`page: ${page}`);
        console.log(`limit: ${limit}`);
        console.log(`conta: ${conta}`);
        const response = await pinata.pinList({
            status: 'pinned',
            metadata: {
                keyvalues: {
                    conta: {
                        value: conta,
                        op: 'eq'
                    }
                }
            }
        });
        var mListaHashs = [];

        response.rows.forEach(row => {
            mListaHashs.push({
                hash: row.ipfs_pin_hash
            })
        });

        res.end(JSON.stringify({
            data: mListaHashs,
            qtd: response.count,
        }));
    } catch(error) {

    }
}

async function create(req, res) {
    try {

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            const {
                id,
                conta,
                nrmatricula, 
                nmproprietario, 
                cpf, 
                rg, 
                email, 
                telefone, 
                celular, 
                cep, 
                logradouro,
                nrlogradouro, 
                bairro, 
                nmcidade, 
                uf, 
                nmpais, 
                valor,

            } = JSON.parse(body);

            let data = {
                "id": id,
                "conta": conta,
                "nrmatricula": nrmatricula,
                "nmproprietario": nmproprietario,
                "cpf": cpf,
                "rg": rg,
                "email": email,
                "telefone": telefone,
                "celular": celular,
                "cep": cep,
                "logradouro": logradouro,
                "nrlogradouro": nrlogradouro,
                "bairro": bairro,
                "nmcidade": nmcidade,
                "uf": uf,
                "nmpais": nmpais,
                "valor": valor
            };

            const options = {
                pinataMetadata: {
                    name: data.nrmatricula.toString(),
                    keyvalues: {
                        nrmatricula: data.nrmatricula.toString(),
                        cpf: data.cpf,
                        conta: data.conta.toString()
                    }
                },
                pinataOptions: {
                    cidVersion: 0
                }            
            }

            const response = await pinata.pinJSONToIPFS(data, options);
            pinata.pinList({
                hashContains: response.IpfsHash
            }).then((result) => {
                console.log(result);
            })

            const urlPin = `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`;

            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                uri: urlPin,
                hash: response.IpfsHash
            }));
        })
    } catch (error) {
        console.log(error);
    };
};

async function deleteToken(req, res) {
    try {
        let hash = req.url.split("/")[3];
        const response = await pinata.unpin(hash);

        res.writeHead(201, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify(response));
    } catch(error) {
        console.log(error);
    }
}

module.exports = {
    getAll,
    create,
    deleteToken,
}