import React from 'react';
import propTypes from 'prop-types';
import { ErrorPage } from 'PresentationalComponents';
import {
    Modal,
    TextContent,
    Button,
    Checkbox
} from '@patternfly/react-core';
import { useQuery } from '@apollo/react-hooks';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import gql from 'graphql-tag';

const QUERY = gql`
{
    profiles {
        edges {
            node {
                id
                name
            }
        }
    }
}
`;

const AssignPoliciesModal = ({ isModalOpen, toggle, fqdn }) => {
    // Display all policies with the same OS as host
    const { data, error, loading } = useQuery(QUERY, { fetchPolicy: 'network-only' });

    if (error) { return <ErrorPage error={error}/>; }

    if (loading) { return <Spinner/>; }

    return (
        <Modal
            isSmall
            title={`Edit policies for ${fqdn}`}
            isOpen={isModalOpen}
            onClose={toggle}
            actions={[
                <Button key='save'
                    aria-label="save"
                    variant='primary'>
                    Save
                </Button>,
                <Button key='cancel' variant='secondary' onClick={toggle}>
                    Cancel
                </Button>
            ]}
        >
            <TextContent>
                Choose which policies {fqdn} should be a part of. Note: Only policies for this
                host operating system are shown.
            </TextContent>
            { data.profiles.edges.map(
                (policy) => <Checkbox key={policy.node.id} label={policy.node.name} aria-label={policy.node.name} />
            )}
        </Modal>
    );
};

AssignPoliciesModal.propTypes = {
    isModalOpen: propTypes.bool,
    toggle: propTypes.func,
    id: propTypes.string.isRequired,
    fqdn: propTypes.string
};

export default AssignPoliciesModal;
