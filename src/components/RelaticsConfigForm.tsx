import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { RefreshIcon } from './icons'
import { RelaticsConfig } from '../interfaces/RelaticsConfig'
import { Citr } from '../Citr'

export const RelaticsConfigForm: React.FC = () => {
    const [config, setConfig] = useState<RelaticsConfig | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)


    useEffect(() => {
        setConfig(Citr.getRelaticsConfig())
    }, [])

    const onFormSubmit = useCallback((ev: FormEvent) => {
        ev.preventDefault()

        const formData = new FormData(ev.target as HTMLFormElement)

        const newConfigObject: RelaticsConfig = {
            workspaceId: formData.get('workspaceId')!.toString(),
            objectId: formData.get('objectId')!.toString(),
            entryCode: formData.get('entryCode')!.toString(),
        }

        try {
            Citr.setRelaticsConfig(newConfigObject)
            
            setSuccessMessage('Instellingen opgelagen')
            setErrorMessage(null)

            setTimeout(() => {
                setSuccessMessage(null)
            }, 3000)
        } catch (e) {
            setErrorMessage("Instellingen konden niet worden opgeslagen")
        }
    }, [])

    return (
        <form className="relatics-settings__container" onSubmit={onFormSubmit}>
            <h3>Relatics instellingen</h3>
            <div>
                <input required name="workspaceId" placeholder="Workspace GUID" defaultValue={config?.workspaceId} />
            </div>
            <div>
                <input required name="entryCode" placeholder="Toegangscode" defaultValue={config?.entryCode} />
            </div>
            <div>
                <input required name="objectId" placeholder="Relatics object code" defaultValue={config?.objectId} />
            </div>

            <div className="button-area">
                <button type="submit">Opslaan</button>
                <button title="Eisenset verversen">
                    <RefreshIcon fill="white" />
                </button>
            </div>
            <p className="success-message">{successMessage}</p>
            <p className="error-message">{errorMessage}</p>

        </form>
    )
}