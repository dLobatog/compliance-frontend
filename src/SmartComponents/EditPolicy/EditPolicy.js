import {
    Dropdown,
    DropdownPosition,
    DropdownToggle,
    DropdownItem,
    Modal,
    Form,
    Title,
    Button
} from '@patternfly/react-core';
import React, { Component } from 'react';
import propTypes from 'prop-types';
import UpdateProfileButton from './UpdateProfileButton';
import ProfileThresholdField from '../ProfileThresholdField/ProfileThresholdField';
import BusinessObjectiveField from '../BusinessObjectiveField/BusinessObjectiveField';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import round from 'lodash/round';

export class EditPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isModalOpen: false,
            policyId: props.policyId,
            businessObjective: props.businessObjective
        };
    }

    handleModalToggle = () => {
        const { isModalOpen } = this.state;
        insights.chrome.appAction(!isModalOpen ? 'edit-business-objective' : '');
        this.setState(() => ({
            isModalOpen: !isModalOpen,
            businessObjective: this.props.businessObjective
        }));
        this.props.onClose();
    };

    onToggle = isOpen => {
        this.setState({
            isOpen
        });
    };

    onSelect = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render() {
        const { policyId, isOpen, isModalOpen, businessObjective } = this.state;
        const { previousThreshold, editPolicyBusinessObjective, complianceThreshold, dispatch } = this.props;
        const dropdownItems = [
            <DropdownItem key="action" onClick={this.handleModalToggle} component="button">
                Edit policy
            </DropdownItem>
        ];

        return (
            <React.Fragment>
                <Dropdown
                    onSelect={this.onSelect}
                    className='policy-details-dropdown'
                    position={DropdownPosition.right}
                    toggle={<DropdownToggle onToggle={this.onToggle}>Actions</DropdownToggle>}
                    isOpen={isOpen}
                    dropdownItems={dropdownItems}
                />
                <Modal
                    isSmall
                    title="Edit policy details"
                    isOpen={isModalOpen}
                    onClose={this.handleModalToggle}
                    isFooterLeftAligned
                    actions={[
                        <Button key="cancel" variant="secondary" onClick={this.handleModalToggle}>
                            Cancel
                        </Button>,
                        <UpdateProfileButton
                            key='confirm'
                            policyId={policyId}
                            threshold={ round(parseFloat(complianceThreshold || previousThreshold), 1) }
                            businessObjective={businessObjective}
                            editPolicyBusinessObjective={editPolicyBusinessObjective}
                            onClick={this.handleModalToggle}
                        />
                    ]}
                >
                    <Form>
                        <Title headingLevel='h3' size='xl'>Business objective</Title>
                        This is an optional field that can be used to label policies that are related to
                        specific business objectives.
                        <BusinessObjectiveField
                            businessObjective={businessObjective}
                            policyId={policyId}
                            dispatch={dispatch}
                        />
                        <Title headingLevel="h3" size="xl">Compliance threshold</Title>
                        The compliance threshold defines what percentage of rules must be met in order for a system to
                        be determined &quot;compliant&quot;
                        <ProfileThresholdField previousThreshold={previousThreshold} />
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

EditPolicy.propTypes = {
    policyId: propTypes.string,
    previousThreshold: propTypes.number,
    businessObjective: propTypes.object,
    editPolicyBusinessObjective: propTypes.object,
    complianceThreshold: propTypes.string,
    onClose: propTypes.func,
    dispatch: propTypes.func
};

const selector = formValueSelector('policyForm');
export default connect(
    state => ({
        complianceThreshold: selector(state, 'complianceThreshold'),
        editPolicyBusinessObjective: selector(state, 'businessObjective')
    })
)(EditPolicy);
