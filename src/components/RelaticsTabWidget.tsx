// import { IModelApp, StandardViewId } from "@bentley/imodeljs-frontend";
import * as React from "react";
import { getRelaticsEisenByNLCSobject, getRelaticsEisenByRelaticsobject } from "../api-helper";
import { Requirement } from "../interfaces/Requirement";

export const RelaticsTabWidget = () => {
  const [requirements, setRequirements] = React.useState<Requirement[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const reqs = await getRelaticsEisenByNLCSobject("427400c4-cfc1-4675-beec-bac5b55e0564")

        // const reqs = await getRelaticsEisenByRelaticsobject('Obj-00001')
        // setRequirements(reqs)
      } catch(e) {
        alert("Relatics eisen konden niet worden opgehaald");
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
                  <td>{requirement.description}</td>
              </tr>
            )
          })}
        </tbody>
    </table>
  )
}