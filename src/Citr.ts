import { SelectionSet } from "@bentley/imodeljs-frontend";
import { UiFramework } from "@bentley/ui-framework";
import { RelaticsConfig } from "./interfaces/RelaticsConfig";
import { Requirement } from "./interfaces/Requirement";
import projectConfig from "./project-config";

export class Citr {
    static getRelaticsConfigKey(): string {
        const {iModelId, contextId} = UiFramework.getIModelConnection()!

        return `Relatics-${contextId}-${iModelId}`
    }

    public static async getRelaticConfigOptions(): Promise<RelaticsConfig[]> {
        // const response = await fetch('/relatics-config-option.json')
        // const json = await response.json()

        // const options: RelaticsConfig[] = [...json.options]

        // console.log(options)

        // return options
        return []
    }

    public static getRelaticsConfig(): RelaticsConfig {
        const configStorageKey = this.getRelaticsConfigKey()

        const localStorageConfig = window.localStorage.getItem(configStorageKey)
        if (!localStorageConfig) {
            console.warn('no relatics config in localStorage')
        }

        const configObject = JSON.parse(localStorageConfig!)

        return configObject as RelaticsConfig
    }

    public static setRelaticsConfig(config: RelaticsConfig) {
        const configStorageKey = this.getRelaticsConfigKey()
        const json = JSON.stringify(config)

        window.localStorage.setItem(configStorageKey, json)
    }

    public static async getLayerFromSelectionSet(set: SelectionSet) {
        if (set.elements.size === 0) {
            return []
        }
        const conn = UiFramework.getIModelConnection()!

        const elemIds = [...set.elements.values()]
        const elemResult = conn.query(`SELECT * FROM BisCore.GeometricElement3d WHERE ECInstanceId IN (${elemIds})`)

        const categoryIds: string[] = []
        for await (const row of elemResult) {
            if (!categoryIds.includes(row.category.id)) {
                categoryIds.push(row.category.id)
            }
        }

        const catResult = conn!.query(`select CodeValue from BisCore.SpatialCategory WHERE ECInstanceId IN (${categoryIds})`)

        // console.log('elemIds', elemIds.map((elemId) => `'${elemId}'`).toString())

        // const catResult = await conn.query(`
        //     SELECT cat.CodeValue 
        //     FROM BisCore.GeometricElement3d ge 
        //     JOIN BisCore.GeometricElement3dIsInCategory ge_cat 
        //         ON ge.ECInstanceId = ge_cat.SourceECInstanceId 
        //     JOIN BisCore.SpatialCategory cat 
        //         ON cat.ECInstanceId = ge_cat.TargetECInstanceId 
        //     WHERE ge.ECInstanceId IN (${elemIds.map((elemId) => `'${elemId}'`)})
        // `)

        const categories: string[] = []
        for await (const row of catResult) {
            console.log(row)
            categories.push(row.codeValue)
        }

        // console.log('cats', categories)

        return categories
    }

    public static async getElementIdsByCategoryNames(categoryNames: string[]): Promise<string[]> {
        if (categoryNames.length === 0) {
            return []
        }

        const conn = UiFramework.getIModelConnection()!
        const result = await conn.query(`
            SELECT ge.ECInstanceId FROM BisCore.GeometricElement3d ge 
            JOIN BisCore.GeometricElement3dIsInCategory ge_cat ON ge.ECInstanceId = ge_cat.SourceECInstanceId 
            JOIN BisCore.SpatialCategory cat ON cat.ECInstanceId = ge_cat.TargetECInstanceId 
            WHERE cat.CodeValue IN (${categoryNames.map((catName) => `'${catName}'`)})
        `)

        const elemIds: string[] = []
        for await (const row of result) {
            elemIds.push(row.id)
        }

        return elemIds
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
        const config = this.getRelaticsConfig()

        const xml = this.getXmlString(
            'GetRelaticsEisenByNLCSobject',
            config.workspaceId,
            [
                {'NCLSObject': nlcsObjectId}
            ],
            config.entryCode
        )

        console.log(process.env)
    
        // const response = await fetch("https://sweco.relaticsonline.com/DataExchange.asmx?wsdl", {
        const response = await fetch(`${projectConfig.MIDDLEWARE_BASE_URL}/GetRelaticsEisenByNLCSobject`, {
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