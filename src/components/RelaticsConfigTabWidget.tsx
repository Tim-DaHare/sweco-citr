import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { EmphasizeElements, IModelApp, SelectionSetEvent } from '@bentley/imodeljs-frontend';
import { Requirement } from "../interfaces/Requirement";
import { Citr } from "../Citr";
import { RelaticsConfigForm } from "./RelaticsConfigForm";
import { UiFramework } from "@bentley/ui-framework";

export const RelaticsConfTabWidget = () => {
  const [requirements, setRequirements] = React.useState<Map<string, Requirement[]>>(new Map<string, Requirement[]>());
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

  return (
    <div>
      <RelaticsConfigForm onPressRefresh={refreshRequirements} />
    </div>
  )
}