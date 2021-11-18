// import { IModelApp, StandardViewId } from "@bentley/imodeljs-frontend";
import * as React from "react";

const xml: string  = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rel="http://www.relatics.com/">

  <soapenv:Header/>

  <soapenv:Body>

    <rel:GetResult>

      <rel:Operation>GetRelaticsEisenByRelaticsobject</rel:Operation>

      <rel:Identification>

        <rel:Identification>

          <rel:Workspace>1149f258-fbc3-4c6f-97ef-78f224eed877</rel:Workspace>

        </rel:Identification>

      </rel:Identification>

      <rel:Parameters>

        <rel:Parameters>

          <rel:Parameter Name="RelaticsobjectID" Value="Obj-00001"/>

        </rel:Parameters>

      </rel:Parameters>

      <rel:Authentication>

        <rel:Authentication>

          <rel:Entrycode>Welkom123</rel:Entrycode>

        </rel:Authentication>

      </rel:Authentication>

    </rel:GetResult>

  </soapenv:Body>

</soapenv:Envelope>
`

interface Eis {
  id: string | null, 
  status: string | null, 
  eis: string | null
}

export function RelaticsTabWidget() {
  const [requirements, setRequirements] = React.useState<Eis[]>([]);

  React.useEffect(() => {
    (async () => {
        try {
            const response = await fetch("https://sweco.relaticsonline.com/DataExchange.asmx?wsdl", {
                method: 'POST',
                headers: {
                  'Content-Type': 'text/xml',
                },
                body: xml,
            })

            const responseXml = await response.text()

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(responseXml, 'text/xml')

            const eisRootElement = xmlDoc.getElementsByTagName("GetRelaticsEisenByRelaticsobject")[0].childNodes[0]

            const reqs: Eis[] = []

            for (const i in eisRootElement.childNodes) {
              const eis = eisRootElement.childNodes[i]

              if (typeof eis !== 'object') return

              const id = (eis.childNodes[0] as Element).getAttribute('ID')
              const status = (eis.childNodes[1] as Element).getAttribute('Status')
              const eisTekst = (eis.childNodes[2].childNodes[0] as Element).getAttribute('Eistekst')

              reqs.push({
                id: id,
                status: status,
                eis: eisTekst
              })
              
              console.log(reqs)
            }

            setRequirements(reqs)

        } catch(e) {
            console.log(e)
        }
    })();
  }, [])

  return (
    <table className="sweco-requirements-table">
        <thead>
            <tr>
                <th>Object ID</th>
                <th>Eis</th>
            </tr>
        </thead>
        <tbody>
          {requirements.map((requirement) => {
              return (
                <tr key={requirement.id}>
                    <td>{requirement.id}</td>
                    <td>{requirement.eis}</td>
                </tr>
            )
          })}
        </tbody>
    </table>
  )
}