import { SelectionSet } from "@bentley/imodeljs-frontend";
import { UiFramework } from "@bentley/ui-framework";

export class Citr {
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
}