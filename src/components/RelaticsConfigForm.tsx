import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { RefreshIcon } from './icons'
import { RelaticsConfig } from '../interfaces/RelaticsConfig'
import { Citr } from '../Citr'
import { TileOptions } from '@bentley/imodeljs-common'



interface RelaticsConfigFormProps {
    onPressRefresh?: () => void
}
export const RelaticsConfigForm: React.FC<RelaticsConfigFormProps> = ({ 
    onPressRefresh = () => {} 
}) => {
    const [config, setConfig] = useState<RelaticsConfig | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    // const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const [selectOptions, setSelectOptions] = useState<RelaticsConfig[]>([])

    useEffect(() => {
        // setConfig(Citr.getRelaticsConfig())
        (async () => {
            const options = await Citr.getRelaticConfigOptions()
            setSelectOptions(options)
        })()
    }, [])

    // const onPressRefreshButton = useCallback(async () => {
    //     setIsRefreshing(true)
    //     await onPressRefresh()
    //     setIsRefreshing(false)
    // }, [])

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
            <div className="flex">
                <h3>Relatics instellingen</h3>
                <a title="Open relatics omgeving" href="https://sweco.relaticsonline.com/" target="_blank"><img src="/RelaticsActive.png"></img></a>
            </div>
            <div>
                <select name="relaticsProject">
                    {selectOptions.map(() => {
                        return (
                            <option>Saaf</option>
                        )
                    })}
                </select>
            </div>
            {/* <div>
                <input required name="workspaceId" placeholder="Workspace GUID" defaultValue={config?.workspaceId} />
            </div>
            <div>
                <input type="password" required name="entryCode" placeholder="Toegangscode" defaultValue={config?.entryCode} />
            </div>
            <div>
                <input required name="objectId" placeholder="Relatics object code" defaultValue={config?.objectId} />
            </div>

            <div className="button-area">
                <button type="submit">Opslaan</button>
                <button type="button" title="Eisenset verversen" onClick={onPressRefreshButton}>
                    <RefreshIcon
                        style={
                            isRefreshing ? { animation: 'spin linear infinite 3s' } 
                            : {}
                        } 
                        fill="white" 
                    />
                </button>
            </div> */}
            <p className="success-message">{successMessage}</p>
            <p className="error-message">{errorMessage}</p>
        </form>
    )
}