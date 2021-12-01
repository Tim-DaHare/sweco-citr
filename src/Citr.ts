import { SelectionSet } from "@bentley/imodeljs-frontend";
import { UiFramework } from "@bentley/ui-framework";
import { RelaticsConfig } from "./interfaces/RelaticsConfig";
import { Requirement } from "./interfaces/Requirement";

export class Citr {

    public static relaticsConfig: RelaticsConfig = {
        workspaceId: '1149f258-fbc3-4c6f-97ef-78f224eed877',
        entryCode: 'Welkom123',
        objectId: '427400c4-cfc1-4675-beec-bac5b55e0564'
    }

    public static async getLayerFromSelectionSet(set: SelectionSet) {
        if (set.elements.size === 0) {
            return []
        }
        const conn = UiFramework.getIModelConnection()

        const elemIds = [...set.elements.values()]
        const elemResult = conn!.query(`SELECT * FROM BisCore.GeometricElement3d WHERE ECInstanceId IN (${elemIds})`)

        const categoryIds: string[] = []
        for await (const row of elemResult) {
            if (!categoryIds.includes(row.category.id)) {
                categoryIds.push(row.category.id)
            }
        }

        const catResult = conn!.query(`select CodeValue from BisCore.SpatialCategory WHERE ECInstanceId IN (${categoryIds})`)

        const categories: string[] = []
        for await (const row of catResult) {
            categories.push(row.codeValue)
        }

        return categories
    }

    static getXmlString(
        operationName: string,
        workspaceId: string,
        parameters: Record<string, string>[],
        entryCode: string
    ) {
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

    static async getRelaticsEisenByNLCSobject(nlcsObjectId: string) {
        const xml = this.getXmlString(
            'GetRelaticsEisenByNLCSobject',
            this.relaticsConfig.workspaceId,
            [
                {'NCLSObject': nlcsObjectId}
            ],
            this.relaticsConfig.entryCode
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
                        
                        const id = (eisObject as Element).getAttribute('ID')
                        const type = (eisObject as Element).nodeName
                        const title = (eisObject as Element).getAttribute(type)
                        const object_id = (eisObject as Element).getElementsByTagName('ID')[0].getAttribute('ID')
                        const status = (eisObject as Element).getElementsByTagName('Status')[0].getAttribute('Status')
                        const description = (eisObject as Element).getElementsByTagName('Eistekst')[0].getAttribute('Eistekst')
                        
                        const requirement: Requirement = {
                            id,
                            object_id,
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
}