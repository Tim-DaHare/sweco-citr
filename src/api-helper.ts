import { Requirement } from "./interfaces/Requirement"

const getXmlString = (
    operationName: string,
    workspaceId: string,
    parameters: Record<string, string>[],
    entryCode: string
) => {
    const parametersString = parameters.reduce((acc, param) => {
        const [key, value] = Object.entries(param)[0]

        return acc.concat(`<rel:Parameter Name="${key}" Value="${value}"/>`)
    }, '')

    let xml: string  = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rel="http://www.relatics.com/">
        <soapenv:Header/>
        <soapenv:Body>
            <rel:GetResult>
                <rel:Operation>${operationName}</rel:Operation>
                <rel:Identification>
                    <rel:Identification>
                        <rel:Workspace>${workspaceId}</rel:Workspace>
                    </rel:Identification>
                </rel:Identification>
                
                <rel:Parameters>
                    <rel:Parameters>
                        ${parametersString}
                    </rel:Parameters>
                </rel:Parameters>
                
                <rel:Authentication>
                    <rel:Authentication>
                        <rel:Entrycode>${entryCode}</rel:Entrycode>
                    </rel:Authentication>
                </rel:Authentication>
            </rel:GetResult>
        </soapenv:Body>
    </soapenv:Envelope>`

    return xml
}

export const getRelaticsEisenByRelaticsobject = async (objectId: string) => {
    const xml = getXmlString(
        'GetRelaticsEisenByRelaticsobject',
        '1149f258-fbc3-4c6f-97ef-78f224eed877',
        [
            {'RelaticsobjectID': objectId}
        ],
        'Welkom123'
    )

    const response = await fetch("https://sweco.relaticsonline.com/DataExchange.asmx?wsdl", {
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml',
        },
        body: xml,
    })

    const responseXml = await response.text()

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(responseXml, 'text/xml')

    const eisRootElement = xmlDoc.getElementsByTagName("GetRelaticsEisenByRelaticsobject")[0].childNodes[0]

    const reqs: Requirement[] = []

    for (const i in eisRootElement.childNodes) {
        const eis = eisRootElement.childNodes[i]

        if (typeof eis !== 'object') continue

        const id = (eis.childNodes[0] as Element).getAttribute('ID')
        const status = (eis.childNodes[1] as Element).getAttribute('Status')
        const eisTekst = (eis.childNodes[2].childNodes[0] as Element).getAttribute('Eistekst')

        // reqs.push({
        //     id: id,
        //     status: status,
        //     description: eisTekst
        // })
    }

    return reqs
}

export const getRelaticsEisenByNLCSobject = async (nclsObjectId: string) => {
    const xml = getXmlString(
        'GetRelaticsEisenByNLCSobject',
        '1149f258-fbc3-4c6f-97ef-78f224eed877',
        [
            {'NCLSObject': nclsObjectId}
        ],
        'Welkom123'
    )

    const response = await fetch("https://sweco.relaticsonline.com/DataExchange.asmx?wsdl", {
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml',
        },
        body: xml,
    })

    const responseXml = await response.text()

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(responseXml, 'text/xml')

    const requirementsRootElement = xmlDoc.getElementsByTagName("GetRelaticsEisenByNLCSobject")[0] as Element

    const requirementLayers: Map<string, Requirement[]> = new Map<string, Requirement[]>()
    requirementsRootElement.childNodes.forEach((nlcsObj) => {
        const nlcsChildEl = nlcsObj as Element

        const layerName = nlcsChildEl.getAttribute('NLCS_Object')!

        const requirements: Requirement[] = [] 
        nlcsObj.childNodes.forEach((fysiekObjectType) => {
            fysiekObjectType.childNodes.forEach((obj) => {
                obj.childNodes.forEach((eisObject) => {
                    
                    const type = (eisObject as Element).nodeName
                    const title = (eisObject as Element).getAttribute(type)
                    const id = (eisObject as Element).getElementsByTagName('ID')[0].getAttribute('ID')
                    const status = (eisObject as Element).getElementsByTagName('Status')[0].getAttribute('Status')
                    const description = (eisObject as Element).getElementsByTagName('Eistekst')[0].getAttribute('Eistekst')
                    
                    const requirement: Requirement = {
                        id,
                        title,
                        status, 
                        description,
                        type
                    }

                    requirements.push(requirement)
                })
            })
        })
        requirementLayers.set(layerName, requirements)
    })

    return requirementLayers
}