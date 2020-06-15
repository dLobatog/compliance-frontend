import React from 'react';
import { SystemsTable } from 'SmartComponents';
import {
    StateViewWithError,
    StateViewPart
} from 'PresentationalComponents';
import { Spinner, PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const GET_POLICIES = gql`
{
    profiles(search: "external = false and canonical = false") {
        edges {
            node {
                id
                name
            }
        }
    }
}
`;
export const ComplianceSystems = () => {
    const columns = [{
        key: 'display_name',
        title: 'Name',
        props: {
            width: 40, isStatic: true
        }
    }, {
        key: 'facts.compliance.policies',
        title: 'Policies',
        props: {
            width: 40, isStatic: true
        }
    }, {
        key: 'facts.compliance.details_link',
        title: '',
        props: {
            width: 20, isStatic: true
        }
    }];

    const { data, error, loading } = useQuery(GET_POLICIES, { fetchPolicy: 'cache-and-network' });
    let systemsTable;
    if (!loading && data) {
        systemsTable = <SystemsTable policiesFilter policies={data.profiles.edges.map(policy => policy.node)}
            showAllSystems remediationsEnabled={false} columns={columns} />;
    }

    return (
        <React.Fragment>
            <PageHeader className='page-header'>
                <PageHeaderTitle title="Compliance systems" />
            </PageHeader>
            <Main>
                <StateViewWithError stateValues={ { error, data, loading } }>
                    <StateViewPart stateKey='loading'>
                        <Spinner/>
                    </StateViewPart>
                    <StateViewPart stateKey='data'>
                        { systemsTable }
                    </StateViewPart>
                </StateViewWithError>
            </Main>
        </React.Fragment>
    );
};

export default routerParams(ComplianceSystems);
