import { ScreenViewport } from "@bentley/imodeljs-frontend";
import { UiFramework } from "@bentley/ui-framework";

export class Citr {
    public initialize (viewPort: ScreenViewport) {
        const conn = UiFramework.getIModelConnection()

        viewPort.iModel.selectionSet.onChanged.addListener(async (selectionSet) => {
            const elemId = [...selectionSet.set.elements.values()][0] // TODO: compare all selected element catergories instead of only the first

            const elemResult = conn!.query(`SELECT * FROM BisCore.GeometricElement3d WHERE ECInstanceId = ${elemId}`)
            const { value: elemData } = await elemResult.next()

            console.log('firstresult', elemData)

            const catResult = conn!.query(`select * from BisCore.SpatialCategory WHERE ECInstanceId = ${elemData.category.id}`)
            const { value: catData } = await catResult.next()

            console.log('catData', catData)
        })
    }
}