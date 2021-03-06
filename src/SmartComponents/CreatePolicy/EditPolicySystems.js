import React, { useEffect } from 'react';
import { propTypes as reduxFormPropTypes, reduxForm } from 'redux-form';
import { Form, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { SystemsTable } from 'SmartComponents';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

const EditPolicySystems = ({ change, selectedSystemIds }) => {
    const columns = [{
        composed: ['facts.os_release', 'display_name'],
        key: 'facts.compliance.display_name',
        title: 'System name',
        props: {
            width: 40, isStatic: true
        }
    }, {
        key: 'facts.compliance.profiles',
        title: 'Policies',
        props: {
            width: 40, isStatic: true
        }
    }];

    useEffect(() => {
        if (selectedSystemIds) {
            change('systems', selectedSystemIds);
        }
    }, [selectedSystemIds]);

    return (
        <React.Fragment>
            <TextContent>
                <Text component={TextVariants.h1}>
                    Systems
                </Text>
                <Text component={TextVariants.h4}>
                    Choose systems to scan with this policy. You can add and remove systems later.
                </Text>
            </TextContent>
            <Form>
                <SystemsTable
                    columns={columns}
                    remediationsEnabled={false}
                    compact
                    showActions={ false }
                    showAllSystems
                    enableExport={ false }/>
            </Form>
        </React.Fragment>
    );
};

EditPolicySystems.propTypes = {
    selectedSystemIds: propTypes.array,
    change: reduxFormPropTypes.change
};

EditPolicySystems.defaultProps = {
    selectedSystemIds: []
};

const mapStateToProps = ({ entities }) => ({
    selectedSystemIds: (entities?.selectedEntities || []).map((e) => (e.id))
});

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true
    })
)(EditPolicySystems);
