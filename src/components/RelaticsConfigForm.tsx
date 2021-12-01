import React from 'react'
import { RefreshIcon } from './icons'

export const RelaticsConfigForm = () => {

    return (
        <form className="relatics-settings__container">
            <h3>Relatics instellingen</h3>
            <div>
                <input placeholder="Workspace GUID" />
            </div>
            <div>
                <input placeholder="Toegangscode" />
            </div>
            <div>
                <input placeholder="Relatics object code" />
            </div>

            <div className="button-area">
            <button type="submit">Opslaan</button>
            <button>
                <RefreshIcon fill="white" />
            </button>
            </div>
        </form>
    )
}