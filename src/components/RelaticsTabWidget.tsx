// import { IModelApp, StandardViewId } from "@bentley/imodeljs-frontend";
import React, { useCallback } from "react";
import { IModelApp, ScreenViewport, SelectionSetEvent } from '@bentley/imodeljs-frontend';
import { getRelaticsEisenByNLCSobject, getRelaticsEisenByRelaticsobject } from "../api-helper";
import { Requirement } from "../interfaces/Requirement";
import { Citr } from "../Citr";

export const RelaticsTabWidget = () => {
  const [requirements, setRequirements] = React.useState<Map<string, Requirement[]>>(new Map<string, Requirement[]>());

  const onSelectCallback = useCallback(async (ev: SelectionSetEvent) => {
    const categories = await Citr.getLayerFromSelectionSet(ev.set)

    console.log(categories)
  }, [requirements])

  React.useEffect(() => {
    const vp = IModelApp.viewManager.getFirstOpenView()

    vp!.iModel.selectionSet.onChanged.addListener(onSelectCallback);

    (async () => {
      try {
        const reqs = await getRelaticsEisenByNLCSobject("427400c4-cfc1-4675-beec-bac5b55e0564")

        // console.log(reqs)
        // const reqs = await getRelaticsEisenByRelaticsobject('Obj-00001')
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
              <th>Object ID</th>
              <th>Status</th>
              <th>Eis</th>
            </tr>
        </thead>
        <tbody>
          {[...requirements].map(([layername, reqs]) => [...reqs].map((req, i) => {
            // FIXME: Use proper id for the row element key
            return (
              <tr key={`${layername}-${req.id}-${req.type}-${i}`}>
                <td>{req.type}</td>
                <td>{req.title}</td>
                <td>{req.id}</td>
                <td>{req.status}</td>
                <td>{req.description}</td>
              </tr>
            )
          }))}
        </tbody>
    </table>
  )
}