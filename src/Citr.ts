import { SelectionSet } from "@bentley/imodeljs-frontend";
import { UiFramework } from "@bentley/ui-framework";

export class Citr {
    public static async getLayerFromSelectionSet(set: SelectionSet) {
        const conn = UiFramework.getIModelConnection()

        const elemId = [...set.elements.values()][0] // TODO: compare all selected element catergories instead of only the first

        const elemResult = conn!.query(`SELECT * FROM BisCore.GeometricElement3d WHERE ECInstanceId = ${elemId}`)
        const { value: elemData } = await elemResult.next()

        const catResult = conn!.query(`select CodeValue from BisCore.SpatialCategory WHERE ECInstanceId = ${elemData.category.id}`)

        const categories: string[] = []
        for await (const row of catResult) {
            categories.push(row.codeValue)
        }

        return categories
    }
}