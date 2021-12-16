import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { EmphasizeElements, IModelApp, SelectionSetEvent } from '@bentley/imodeljs-frontend';
import { Requirement } from "../interfaces/Requirement";
import { Citr } from "../Citr";
import { RelaticsConfigForm } from "./RelaticsConfigForm";
import { RelaticsConfig } from "../interfaces/RelaticsConfig";

export const RelaticsTabWidget = () => {
  const [requirements, setRequirements] = React.useState<Map<string, Requirement[]>>(new Map<string, Requirement[]>());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTypes, setselectedTypes] = useState<string[]>([
    'Klanteis', 
    'Contracteis_product', 
    'Systeemeis'
  ])
  const [emphasizedLayers, setEmphasizedLayers] = useState<string[]>([])
  const [relaticsConfig, setRelaticsConfig] = useState<RelaticsConfig>();

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

  const onSelectConfig = useCallback(async (config: RelaticsConfig) => {
    try {
      const reqs = await Citr.getRelaticsEisenByNLCSobject(config)
      setRequirements(reqs)

      Citr.setStoredRelaticsConfigTitle(config.title)
      setRelaticsConfig(config)
    } catch(e) {
      alert("Relatics eisen konden niet worden opgehaald");
    }
  }, [])

  // Init effect
  useEffect(() => {
    (async () => {
      const vp = IModelApp.viewManager.getFirstOpenView()!
      vp.iModel.selectionSet.onChanged.addListener(onSelectCallback);
      const options = await Citr.getRelaticConfigOptions()
      const confTitle = Citr.getStoredRelaticsConfigTitle()

      if (!confTitle) {
        return
      }

      const config = options.find((o) => o.title === confTitle) 
      if (!config) {
        return
      }

      setRelaticsConfig(config)
  
      const reqs = await Citr.getRelaticsEisenByNLCSobject(config)
      setRequirements(reqs)
    })()
  }, [onSelectCallback])

  const disableEhphasize = useCallback(() => {
    const vp = IModelApp.viewManager.getFirstOpenView()!
    const emph = EmphasizeElements.getOrCreate(vp)

    emph.clearEmphasizedElements(vp)

    setEmphasizedLayers([])
  }, [])

  const toggleLayerEhphasis = useCallback(async (layerName: string) => {
    const newEmphasizedLayers = [...emphasizedLayers]

    const layerIndex = newEmphasizedLayers.indexOf(layerName)
    if (layerIndex === -1) {
      newEmphasizedLayers.push(layerName)
    } else {
      newEmphasizedLayers.splice(layerIndex, 1)
    }

    setEmphasizedLayers(newEmphasizedLayers)

    if (newEmphasizedLayers.length === 0) {
      disableEhphasize()
      return
    }

    const elemIds = await Citr.getElementIdsByCategoryNames(newEmphasizedLayers)

    const vp = IModelApp.viewManager.getFirstOpenView()!
    const emph = EmphasizeElements.getOrCreate(vp)

    emph.emphasizeElements(elemIds, vp)
  }, [emphasizedLayers])

  const filteredReqs = [...requirements].filter(([layerName, reqs]) => {
    const layerIsInSelectedCategories = selectedCategories.some((l) => layerName.substr(0, 7) === l.substr(0, 7))
    
    if (selectedCategories.length !== 0 && !layerIsInSelectedCategories) return false

    const filteredReqs = reqs.filter((req) => selectedTypes.includes(req.type))

    return !!filteredReqs.length
  })

  return (
    <div>
      <details className="relatics-details">
        <summary>
            instellingen
            {relaticsConfig && (
              <a
                title="Open relatics omgeving" 
                href={`https://sweco.relaticsonline.com/${relaticsConfig.workspaceId}`} 
                target="_blank"
              >
                <img src="/RelaticsActive.png" />
              </a>
            )}
        </summary>
        <RelaticsConfigForm config={relaticsConfig} onSelect={(config: RelaticsConfig) => onSelectConfig(config)} />
      </details>

      <div className="table-header">
        <div className="category-filter">
          <span>Filter type eisen: </span>
          <div>
            <label htmlFor="Klanteis">Klanteis</label>
            <input id="Klanteis" type="checkbox" name="type" value="Klanteis" defaultChecked onChange={onReqfilterChange} />
          </div>
          <div>
            <label htmlFor="Contracteis_product">Contracteis</label>
            <input id="Contracteis_product" type="checkbox" name="type" value="Contracteis_product" defaultChecked onChange={onReqfilterChange}  />
          </div>
          <div>
            <label htmlFor="Systeemeis">Systeemeis</label>
            <input id="Systeemeis" type="checkbox" name="type" value="Systeemeis" defaultChecked onChange={onReqfilterChange} />
          </div>
        </div>

        {emphasizedLayers.length > 0 && (
          <button type="button" onClick={disableEhphasize}>Highlights Uit</button>
        )}
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
                    <td colSpan={5}>
                      <div className="layer-indicator">
                        <span>{layername}</span>
                        <span>
                          Highlight 
                          <input 
                            type="checkbox" 
                            name={`emphasize-${layername}`}
                            onChange={() => toggleLayerEhphasis(layername)} 
                            checked={emphasizedLayers.includes(layername)} 
                          />
                        </span>
                      </div>
                    </td>
                  </tr>
                  {reqs.map((req, i) => {
                    if (!selectedTypes.includes(req.type)) return React.Fragment
                    // FIXME: Find a real key value for the table row
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