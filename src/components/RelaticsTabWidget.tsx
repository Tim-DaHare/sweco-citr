// import { IModelApp, StandardViewId } from "@bentley/imodeljs-frontend";
import React, { useCallback, useState } from "react";
import { IModelApp, SelectionSetEvent } from '@bentley/imodeljs-frontend';
import { 
  getRelaticsEisenByNLCSobject, 
  // getRelaticsEisenByRelaticsobject 
} from "../api-helper";
import { Requirement } from "../interfaces/Requirement";
import { Citr } from "../Citr";

export const RelaticsTabWidget = () => {
  const [requirements, setRequirements] = React.useState<Map<string, Requirement[]>>(new Map<string, Requirement[]>());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const onSelectCallback = useCallback(async (ev: SelectionSetEvent) => {
    // console.log(ev)
    const categories = await Citr.getLayerFromSelectionSet(ev.set)

    setSelectedCategories(categories)

    // console.log(categories)
  }, [requirements])

  React.useEffect(() => {
    const vp = IModelApp.viewManager.getFirstOpenView()

    vp!.iModel.selectionSet.onChanged.addListener(onSelectCallback);

    (async () => {
      try {
        const reqs = await getRelaticsEisenByNLCSobject("427400c4-cfc1-4675-beec-bac5b55e0564")
        // const reqs = await getRelaticsEisenByRelaticsobject('Obj-00001')
        
        // console.log(reqs)
        setRequirements(reqs)
      } catch(e) {
        alert("Relatics eisen konden niet worden opgehaald");
      }
    })();
  }, [])

  return (
    <table className="sweco-requirements-table">
        <thead>
            <tr>
              <th>Type</th>
              <th>Titel</th>
              <th>Eis</th>
              <th>Object ID</th>
              <th>Status</th>
            </tr>
        </thead>
        <tbody>
          {[...requirements].map(([layername, reqs]) => {

            if (selectedCategories.length > 0 && !selectedCategories.includes(layername)) return

            return (
              <React.Fragment key={`${layername}`}>
                <tr>
                  <td className="layer-indicator" colSpan={5}>{layername}</td>
                </tr>
                {[...reqs].map((req, i) => {
                    return (
                      <tr key={`${layername}-${req.id}-${req.type}-${i}`}>
                        <td>{req.type}</td>
                        <td>{req.title}</td>
                        <td>{req.description}</td>
                        <td>{req.id}</td>
                        <td>{req.status}</td>
                      </tr>
                    )
                  })}
              </React.Fragment>
            )
          })}
        </tbody>
    </table>
  )
}