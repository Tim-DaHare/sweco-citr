// import { IModelApp, StandardViewId } from "@bentley/imodeljs-frontend";
import * as React from "react";
import { getRelaticsEisenByRelaticsobject } from "../api-helper";
import { Eis } from "../interfaces/requirement";

export function RelaticsTabWidget() {
  const [requirements, setRequirements] = React.useState<Eis[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const reqs = await getRelaticsEisenByRelaticsobject()
        setRequirements(reqs)
      } catch(e) {
        // TODO: Waarschuwing popup laten zien
        console.warn('getRelaticsEisenByRelaticsobject failed to fetch requirements', e)
      }
    })();
  }, [])

  return (
    <table className="sweco-requirements-table">
        <thead>
            <tr>
                <th>Object ID</th>
                <th>Status</th>
                <th>Eis</th>
            </tr>
        </thead>
        <tbody>
          {requirements.map((requirement) => {
            return (
              <tr key={requirement.id}>
                  <td>{requirement.id}</td>
                  <td>{requirement.status}</td>
                  <td>{requirement.eis}</td>
              </tr>
            )
          })}
        </tbody>
    </table>
  )
}