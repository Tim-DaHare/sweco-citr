import React from 'react'
import { RefreshIcon } from './icons'
import { RelaticsConfig } from '../interfaces/RelaticsConfig'
import { Citr } from '../Citr'

interface RelaticsConfigFormProps {
    config?: RelaticsConfig
}

export const RelaticsConfigForm: React.FC<RelaticsConfigFormProps> = ({
    config
}) => {

    config = Citr.relaticsConfig
    return (
        <form className="relatics-settings__container">
            <h3>Relatics instellingen</h3>
            <div>
                <input placeholder="Workspace GUID" defaultValue={config?.workspaceId} />
            </div>
            <div>
                <input placeholder="Toegangscode" defaultValue={config?.entryCode} />
            </div>
            <div>
                <input placeholder="Relatics object code" defaultValue={config?.objectId} />
            </div>

            <div className="button-area">
            <button type="submit">Opslaan</button>
            <button title="Eisenset verversen">
                <RefreshIcon fill="white" />
            </button>
            </div>
        </form>
    )
}