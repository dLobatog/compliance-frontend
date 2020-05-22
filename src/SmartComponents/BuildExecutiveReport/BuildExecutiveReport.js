import React, { Fragment } from 'react';
import {
    Paragraph,
    Section,
    Column
} from '@redhat-cloud-services/frontend-components-pdf-generator';

const buildExecutiveReport = () => {
    return (
        [<Fragment key="first-section">
            <Paragraph>
                This is an executive summary of a compliance policy identified by Red Hat that may impact your
                \nRed Hat Enterprise Linux (RHEL) servers.
            </Paragraph>
            <Paragraph>
            </Paragraph>
            <Section title={'Systems summary'}>
                <Column>
                </Column>
                <Column>
                </Column>
            </Section>
        </Fragment>]
    );
};

export default buildExecutiveReport;
