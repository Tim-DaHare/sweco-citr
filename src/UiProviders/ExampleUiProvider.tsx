import React from 'react';
import {
    AbstractWidgetProps,
    StagePanelLocation,
    StagePanelSection,
    UiItemsProvider,
} from '@bentley/ui-abstract';

export class ExampleUiProvider implements UiItemsProvider {
    public readonly id = "ExampleUiProviderId";

    public provideWidgets(
        stageId: string,
        stageUsage: string,
        location: StagePanelLocation,
        section?: StagePanelSection
    ): ReadonlyArray<AbstractWidgetProps> {
        const widgets: AbstractWidgetProps[] = [];

        if (
            location === StagePanelLocation.Right &&
            section === StagePanelSection.Start
        ) {

            const relaticsWidget: AbstractWidgetProps = {
                id: 'exampledId',
                label: 'Ron Doest',
                getWidgetContent() {
                    return (
                        // <p style={{ color: 'white' }}>Caxi tasper is de beste caxi.</p>
                        <>
                            <img style={{ width: 300, height: 300}} src={`https://media-exp1.licdn.com/dms/image/C4D03AQG0JB3tZqikCQ/profile-displayphoto-shrink_200_200/0/1623260452303?e=1640217600&v=beta&t=QQ2GSn8MQYUI-_BdOdOL1H6UfEe4GW3loqLyS9W4w4E`} />
                            <img style={{ width: 300, height: 300}} src={`https://media-exp1.licdn.com/dms/image/C4D03AQFkLa4xsZBAwg/profile-displayphoto-shrink_200_200/0/1595767253917?e=1642032000&v=beta&t=7_aTAfSGqlDQUqxJ96feyny8sXMKoXG4QDlgHoyucjk`} />
                        </>
                    ) 
                },
            };

            widgets.push(relaticsWidget);
        }

        return widgets;
    }
}