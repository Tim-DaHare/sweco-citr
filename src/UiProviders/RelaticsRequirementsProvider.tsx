import React from 'react';
import {
    AbstractWidgetProps,
    StagePanelLocation,
    StagePanelSection,
    UiItemsProvider,
} from '@bentley/ui-abstract';

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
            const requirements = {
                "7be588f0-f40e-43d8-b8d0-7909001c58bd": "Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
                "0b8e739b-9680-4ee3-8d60-cdb0c5601c6f": "Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.",
                "8a66019e-c2c7-499a-9998-0324cd8755fe": "Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl.",
                "ae8500c5-3e4a-4ce7-a2ca-d2fd7a5bdd29": "Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
                "3f7b2382-09d7-498c-8b39-b0629d6362f8": "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst.",
                "e01a8342-9c67-4220-9512-a10a7d0ff5c3": "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla.",
                "07752100-de64-4e46-a023-071dae71c456": "Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc.",
                "273bd5d2-07c8-49e2-a3ff-3ce2420eb25a": "Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc.",
                "44310ba4-67e5-400b-9728-9ae16a80029d": "Integer ac neque. Duis bibendum.",
                "d91672ee-25b4-4bd5-8268-6423809f3bbd": "Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl.",
                "d1183e2d-7a53-4360-83a8-b3355c5d727d": "Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.",
                "04b25fea-f0e3-43aa-8308-fe4d1bd12688": "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem.",
                "34f4aefa-761e-4ffe-8458-eafc20b38e98": "Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.",
                "19712f29-e7e7-4262-8f8a-0c7da98afe5d": "Duis aliquam convallis nunc.",
                "d3154347-b748-4607-9102-109faa4b4e59": "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros.",
                "eb62be48-64c7-4ef3-82df-94474717ccea": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.",
                "ce4afbb3-2952-48c8-a008-4f8716a3b905": "Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante.",
                "59429999-6d36-4ca9-9705-0a523ac9c61c": "Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim.",
                "e79825a6-0c97-4573-a7ee-c3a9ce97a4e0": "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui.",
                "f81d849e-b6c5-4c91-bc70-7f24f2e53f13": "Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy.",
                "73b49f3f-ac91-4901-a165-e96cb28b4bfc": "Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui.",
                "71b88e66-c782-4cec-a612-f666482537f7": "Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam. Nam tristique tortor eu pede.",
                "d900f47b-f2dc-422d-9945-da5fe2707e47": "Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc.",
                "643d2070-6ee1-45e8-bbc4-0461e5586da1": "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus.",
                "3d50f15e-7de0-458c-aa4d-b46b7731842f": "In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",
                "a06c6874-4937-47c5-9723-dbe94dc6baa5": "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui.",
                "2f863ff8-53e8-4b55-8d38-6b73b0ce197a": "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum.",
                "3cbded2f-1dc2-4336-8870-c5f22c72b44b": "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl.",
                "8589bf4a-2bd0-4e5f-a23b-cdbb19c17d82": "Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.",
                "8f4b98e6-a5ce-4d6d-a53b-d4e125a35af0": "Pellentesque ultrices mattis odio. Donec vitae nisi.",
            }

            const relaticsWidget: AbstractWidgetProps = {
                id: 'relaticsWidget',
                label: 'Relatics',
                getWidgetContent() {
                    return (
                        <table className="sweco-requirements-table">
                            <tr>
                                <th>Object ID</th>
                                <th>Eis</th>
                            </tr>
                            {Object.entries(requirements).map(([key, value]) => {
                                return (
                                    <tr>
                                        <td>{key}</td>
                                        <td>{value}</td>
                                    </tr>
                                )
                            })}
                        </table>
                    ) 
                },
            };

            widgets.push(relaticsWidget);
        }

        return widgets;
    }
}