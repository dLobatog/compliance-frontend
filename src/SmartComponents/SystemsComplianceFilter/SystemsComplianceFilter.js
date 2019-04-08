import React from 'react';
import propTypes from 'prop-types';
import { FilterDropdown } from '@red-hat-insights/insights-frontend-components';
import { FILTER_CATEGORIES } from '../../constants';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';

const GET_SYSTEMS = gql`
query getSystems($filter: String!) {
    allSystems(search: $filter) { id }
}
`;

class SystemsComplianceFilter extends React.Component {
    state = {
        compliant: this.props.compliant,
        complianceScore: this.props.complianceScore
    };

    buildFilter = () => {
        const { compliant, complianceScore } = this.state;
        let filter = '';

        compliant.forEach((compliant) => {
            if (filter !== '') {
                filter += (' or ');
            }

            filter += ('compliant = ' + compliant);
        });

        complianceScore.forEach((scoreRange, index) => {
            if (index === 0 && filter !== '') { filter += ' and '; }

            if (index !== 0 && filter !== '') { filter += ' or '; }

            scoreRange = scoreRange.split('-');
            filter += ('compliance_score >= ' + scoreRange[0] +
                       ' and compliance_score <= ' + scoreRange[1]);
        });

        return filter;
    }

    updateInventory = () => {
        const { client, onRefresh } = this.props;
        const filter = this.buildFilter();

        client.query({ query: GET_SYSTEMS, variables: { filter } })
        .then((items) => {
            onRefresh(items.data.allSystems, true);
        });
    }

    addFilter = (filterName, selectedValue) => {
        const { compliant, complianceScore } = this.state;

        if (filterName === 'compliant') {
            compliant.push(selectedValue);
            this.setState({ compliant }, this.updateInventory);
        } else if (filterName === 'complianceScore') {
            complianceScore.push(selectedValue);
            this.setState({ complianceScore }, this.updateInventory);
        }
    }

    removeFilter = (filterName, selectedValue) => {
        const { compliant, complianceScore } = this.state;

        if (filterName === 'compliant') {
            this.setState({ compliant: compliant.filter((value) => value !== selectedValue) }, this.updateInventory);
        } else if (filterName === 'complianceScore') {
            complianceScore.push(selectedValue);
            this.setState({ complianceScore: complianceScore.filter((value) => value !== selectedValue) }, this.updateInventory);
        }
    }

    render() {
        return (
            <FilterDropdown
                addFilter={ this.addFilter }
                removeFilter={ this.removeFilter }
                filterCategories={ FILTER_CATEGORIES }
            />
        );
    }
}

SystemsComplianceFilter.propTypes = {
    onRefresh: propTypes.function,
    client: propTypes.object,
    compliant: propTypes.array,
    complianceScore: propTypes.array
};

SystemsComplianceFilter.defaultProps = {
    compliant: [],
    complianceScore: []
};

export default withApollo(SystemsComplianceFilter);
