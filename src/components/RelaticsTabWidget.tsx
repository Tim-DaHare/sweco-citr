import React, { useCallback, useEffect, useState } from "react";
import { IModelApp, SelectionSetEvent } from '@bentley/imodeljs-frontend';
import { Requirement } from "../interfaces/Requirement";
import { Citr } from "../Citr";
import { RelaticsConfigForm } from "./RelaticsConfigForm";

export const RelaticsTabWidget = () => {
  const [requirements, setRequirements] = React.useState<Map<string, Requirement[]>>(new Map<string, Requirement[]>());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTypes, setselectedTypes] = useState<string[]>([
    'Klanteis', 
    'Contracteis_product', 
    'Systeemeis'
  ])

  const onSelectCallback = useCallback(async (ev: SelectionSetEvent) => {
    const categories = await Citr.getLayerFromSelectionSet(ev.set)

    setSelectedCategories(categories)
  }, [])

  const onReqfilterChange = useCallback((e) => {
    const currTypes = [...selectedTypes]
    const i = currTypes.findIndex((t) => t === e.target.value)

    if (i === -1) {
      currTypes.push(e.target.value)
    } else {
      currTypes.splice(i, 1)
    }

    setselectedTypes(currTypes)
  }, [selectedTypes])

  const refreshRequirements = useCallback(async () => {
    try {
      const reqs = await Citr.getRelaticsEisenByNLCSobject("427400c4-cfc1-4675-beec-bac5b55e0564")
      // console.log(reqs)

      // const reqs = await getRelaticsEisenByRelaticsobject('Obj-00001')

      setRequirements(reqs)
    } catch(e) {
      alert("Relatics eisen konden niet worden opgehaald");
    }
  }, [])

  useEffect(() => {
    const vp = IModelApp.viewManager.getFirstOpenView()!
    vp.iModel.selectionSet.onChanged.addListener(onSelectCallback);

    refreshRequirements()
  }, [onSelectCallback])

  const filteredReqs = [...requirements].filter(([layerName, reqs]) => {
    const layerIsInSelectedCategories = selectedCategories.some((l) => layerName.substr(0, 7) === l.substr(0, 7))
    
    if (selectedCategories.length !== 0 && !layerIsInSelectedCategories) return false

    const filteredReqs = reqs.filter((req) => selectedTypes.includes(req.type))

    return !!filteredReqs.length
  })

  return (
    <div>
      <RelaticsConfigForm onPressRefresh={refreshRequirements} />

      <div className="category-filter">
        <span>Filter type eisen: </span>
        <div>
          <input id="Klanteis" type="checkbox" name="type" value="Klanteis" defaultChecked onChange={onReqfilterChange} />
          <label htmlFor="Klanteis">Klanteis</label>
        </div>
        <div>
          <input id="Contracteis_product" type="checkbox" name="type" value="Contracteis_product" defaultChecked onChange={onReqfilterChange}  />
          <label htmlFor="Contracteis_product">Contracteis</label>
        </div>
        <div>
          <input id="Systeemeis" type="checkbox" name="type" value="Systeemeis" defaultChecked onChange={onReqfilterChange} />
          <label htmlFor="Systeemeis">Systeemeis</label>
        </div>
      </div>

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
          {filteredReqs.length > 0 ? (
            filteredReqs.map(([layername, reqs]) => {
              return (
                <React.Fragment key={`${layername}`}>
                  <tr>
                    <td className="layer-indicator" colSpan={5}>{layername}</td>
                  </tr>
                  {reqs.map((req, i) => {
                    // FIXME: Find a real key value for the table row

                    if (!selectedTypes.includes(req.type)) return React.Fragment

                    return (
                      <tr key={`${layername}-${req.title}-${req.object_id}-${i}`}>
                        <td>{req.type}</td>
                        <td>{req.title}</td>
                        <td>{req.description}</td>
                        <td>{req.object_id}</td>
                        <td>{req.status}</td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              )
            })
          ) : (
            <tr>
              <td colSpan={5}>Er zijn bestaan geen eisen voor de huidige filters en selecties</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}