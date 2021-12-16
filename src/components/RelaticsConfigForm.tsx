import React, { useEffect, useState } from 'react'
import { RelaticsConfig } from '../interfaces/RelaticsConfig'
import { Citr } from '../Citr'

interface RelaticsConfigFormProps {
    config?: RelaticsConfig
    onSelect?: (config: RelaticsConfig) => void
}
export const RelaticsConfigForm: React.FC<RelaticsConfigFormProps> = ({
    config,
    onSelect = () => {} 
}) => {
    const [selectOptions, setSelectOptions] = useState<RelaticsConfig[]>([])

    useEffect(() => {
        (async () => {
            const options = await Citr.getRelaticConfigOptions()
            setSelectOptions(options)
        })()
    }, [])

    return (
        <form className="relatics-settings__container">
            <p>Project: </p>
            <select value={config ? config.title : 'none'} name="relaticsProject" onChange={(e) => {
                const optionValue = (e.target as HTMLSelectElement).value
                const i = selectOptions.findIndex((opt) => opt.title === optionValue)

                onSelect(selectOptions[i])
            }}>
                <option value={'none'} disabled hidden>Kies een Relatics project</option>
                {selectOptions.map((opt) => {
                    return (
                        <option key={opt.title} value={opt.title}>{opt.title}</option>
                    )
                })}
            </select>
        </form>
    )
}