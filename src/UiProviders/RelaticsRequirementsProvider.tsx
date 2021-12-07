import React from 'react';
import {
    AbstractWidgetProps,
    StagePanelLocation,
    StagePanelSection,
    UiItemsProvider,
} from '@bentley/ui-abstract';
import { RelaticsTabWidget } from '../components/RelaticsTabWidget';
import { RelaticsConfTabWidget } from '../components/RelaticsConfigTabWidget';

export class RelaticsRequirementsUiProvider implements UiItemsProvider {
    public readonly id = "RelaticsRequirementsProviderId";

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
                id: 'relaticsWidget',
                label: 'Relatics',
                getWidgetContent() {
                    return (
                        <RelaticsTabWidget /> 
                    )
                },
            };

            const relaticsConfWidget: AbstractWidgetProps = {
                id: 'relaticsConfWidget',
                label: 'Config',
                getWidgetContent() {
                    return (
                        <RelaticsConfTabWidget /> 
                    )
                },
            };

            widgets.push(relaticsWidget,relaticsConfWidget);
        }

        return widgets;
    }
}