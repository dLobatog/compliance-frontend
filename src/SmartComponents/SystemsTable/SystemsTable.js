import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import propTypes from 'prop-types';
import { entitiesReducer } from '../../store/Reducers/SystemStore';
import DownloadTableButton from '../DownloadTableButton/DownloadTableButton';
import ComplianceRemediationButton from '../ComplianceRemediationButton/ComplianceRemediationButton';
import { registry } from '@red-hat-insights/insights-frontend-components';
import { PaginationRow } from 'patternfly-react';

@registry()
class SystemsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InventoryCmp: () => <div>Loading...</div>
        };

        this.fetchInventory = this.fetchInventory.bind(this);
        this.fetchInventory();
    }

    async fetchInventory() {
        const {
            inventoryConnector,
            INVENTORY_ACTION_TYPES,
            mergeWithEntities
        } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReact: { PaginationRow }
        });

        this.getRegistry().register({
            ...mergeWithEntities(
                entitiesReducer(
                    INVENTORY_ACTION_TYPES, this.props.items, this.props.columns
                ))
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryTable
        });
    }

    render() {
        const { InventoryCmp } = this.state;
        const { columns } = this.props;

        return (
            <InventoryCmp>
                <reactCore.ToolbarGroup>
                    <reactCore.ToolbarItem style={{ marginLeft: 'var(--pf-global--spacer--lg)' }}>
                        <ComplianceRemediationButton />
                    </reactCore.ToolbarItem>
                    <reactCore.ToolbarItem style={{ marginLeft: 'var(--pf-global--spacer--md)' }}>
                        <DownloadTableButton columns={columns} />
                    </reactCore.ToolbarItem>
                </reactCore.ToolbarGroup>
            </InventoryCmp>
        );
    }
}

SystemsTable.propTypes = {
    items: propTypes.array,
    columns: propTypes.array
};

export default SystemsTable;
