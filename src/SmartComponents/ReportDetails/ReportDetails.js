import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { ChartDonut, ChartThemeColor, ChartThemeVariant } from '@patternfly/react-charts';
import { Breadcrumb, BreadcrumbItem, Button, Grid, GridItem } from '@patternfly/react-core';

import {
    PageHeader, PageHeaderTitle, Main, EmptyTable, Spinner
} from '@redhat-cloud-services/frontend-components';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';

import { fixedPercentage, pluralize } from 'Utilities/TextHelper';
import {
    ReportDetailsContentLoader, ReportDetailsDescription, StateViewWithError, StateViewPart
} from 'PresentationalComponents';
import { DeleteReport, SystemsTable } from 'SmartComponents';

import '@/Charts.scss';
import './ReportDetails.scss';

export const QUERY = gql`
query Profile($policyId: String!){
    profile(id: $policyId) {
        id
        name
        refId
        totalHostCount
        compliantHostCount
        complianceThreshold
        majorOsVersion
        lastScanned
        policy {
            id
        }
        benchmark {
            id
            version
        }
        businessObjective {
            id
            title
        }
    }
}
`;

export const ReportDetails = ({ match, history }) => {
    const { data, error, loading } = useQuery(QUERY, {
        variables: { policyId: match.params.report_id }
    });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const beta = window.insights.chrome.isBeta();
    const redirect = () => {
        history.push('insights/compliance/reports');
    };

    let donutValues = [];
    let donutId = 'loading-donut';
    let profile = {};
    let legendData;
    let compliancePercentage;

    if (!loading && data) {
        profile = data.profile;
        const compliantHostCount = profile.compliantHostCount;
        const totalHostCount = profile.totalHostCount;
        donutId = profile.name.replace(/ /g, '');
        donutValues = [
            { x: 'Compliant', y: compliantHostCount },
            { x: 'Non-compliant', y: totalHostCount - compliantHostCount }
        ];
        legendData = [
            { name: donutValues[0].y + ' ' + pluralize(donutValues[0].y, 'system') + ' compliant' },
            { name: donutValues[1].y + ' ' + pluralize(donutValues[1].y, 'system') + ' non-compliant' }
        ];
        compliancePercentage = fixedPercentage(Math.floor(100 *
                (donutValues[0].y / (donutValues[0].y + donutValues[1].y))));
    }

    const columns = [{
        key: 'facts.compliance.display_name',
        title: 'System name',
        props: {
            width: 30
        }
    }, {
        key: 'facts.compliance.rules_failed',
        title: 'Rules failed',
        props: {
            width: 5
        }
    }, {
        key: 'facts.compliance.compliance_score',
        title: 'Compliance score',
        props: {
            width: 5
        }
    }, {
        key: 'facts.compliance.last_scanned',
        title: 'Last scanned',
        props: {
            width: 10
        }
    }];

    return <StateViewWithError stateValues={ { error, data, loading } }>
        <StateViewPart stateKey='loading'>
            <PageHeader><ReportDetailsContentLoader/></PageHeader>
            <Main><EmptyTable><Spinner/></EmptyTable></Main>
        </StateViewPart>
        <StateViewPart stateKey='data'>
            <PageHeader>
                <Breadcrumb>
                    <BreadcrumbItem to={`${ beta ? '/beta/insights' : '/rhel' }/compliance/reports`}>
                        Reports
                    </BreadcrumbItem>
                    <BreadcrumbItem isActive>{profile.name}</BreadcrumbItem>
                </Breadcrumb>
                <Grid gutter='lg'>
                    <GridItem sm={9} md={9} lg={9} xl={9}>
                        <PageHeaderTitle title={profile.name + ' report'} />
                    </GridItem>
                    <GridItem className='report-details-button' sm={3} md={3} lg={3} xl={3}>
                        <Button
                            isInline
                            variant="link"
                            onClick={
                                () => setDeleteModalOpen(true)
                            }>
                            Delete Report
                        </Button>
                    </GridItem>
                </Grid>
                <Grid gutter='md'>
                    <GridItem sm={12} md={12} lg={12} xl={6}>
                        <div className='chart-inline'>
                            <div className='chart-container'>
                                <ChartDonut data={donutValues}
                                    identifier={donutId}
                                    title={compliancePercentage}
                                    subTitle="Compliant"
                                    themeColor={ChartThemeColor.blue}
                                    themeVariant={ChartThemeVariant.light}
                                    style={{ fontSize: 20 }}
                                    innerRadius={88}
                                    width={462}
                                    legendPosition='right'
                                    legendData={legendData}
                                    legendOrientation='vertical'
                                    padding={{
                                        bottom: 20,
                                        left: 0,
                                        right: 250,
                                        top: 20
                                    }}
                                />
                            </div>
                        </div>

                    </GridItem>
                    <GridItem sm={12} md={12} lg={12} xl={6}>
                        <ReportDetailsDescription profile={profile} />
                    </GridItem>
                </Grid>
            </PageHeader>
            <Main>
                <Grid gutter='md'>
                    <GridItem span={12}>
                        <SystemsTable
                            showOnlySystemsWithTestResults
                            compliantFilter
                            policyId={profile.id}
                            columns={columns} />
                    </GridItem>
                </Grid>
            </Main>
            <DeleteReport
                isModalOpen={ deleteModalOpen }
                policyId={ profile.id }
                onClose={ (removed) => {
                    setDeleteModalOpen(false);
                    if (removed) {
                        redirect();
                    }
                } } />
        </StateViewPart>
    </StateViewWithError>;
};

ReportDetails.propTypes = {
    match: propTypes.object,
    history: propTypes.object
};

export default routerParams(ReportDetails);
