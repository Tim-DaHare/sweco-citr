import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { EmphasizeElements, IModelApp, SelectionSetEvent } from '@bentley/imodeljs-frontend';
import { Requirement } from "../interfaces/Requirement";
import { Citr } from "../Citr";
import { RelaticsConfigForm } from "./RelaticsConfigForm";
import { UiFramework } from "@bentley/ui-framework";

export const RelaticsConfTabWidget = () => {
  const refreshRequirements = useCallback(async () => {
    try {
      const reqs = await Citr.getRelaticsEisenByNLCSobject("427400c4-cfc1-4675-beec-bac5b55e0564")
      
      // TODO refresh data in relaticsTabWidget
    } catch(e) {
      alert("Relatics eisen konden niet worden opgehaald");
    }
  }, [])

  return (
      <RelaticsConfigForm onPressRefresh={refreshRequirements} />
  )
}