import toJson from 'enzyme-to-json';
import { useQuery } from '@apollo/react-hooks';
import { CompliancePolicies } from './CompliancePolicies.js';

jest.mock('@apollo/react-hooks');
jest.mock('../CreatePolicy/EditPolicyRules', () => {
    return <p>Rules table</p>;
});

describe('CompliancePolicies', () => {
    it('expect to render without error', () => {
        useQuery.mockImplementation(() => ({
            data: {
                profiles: {
                    edges: [{
                        id: '1',
                        refId: '121212',
                        name: 'profile1',
                        complianceThreshold: 90.0,
                        businessObjective: {
                            id: '1',
                            title: 'BO 1'
                        }
                    }]
                }
            }, error: false, loading: false }));

        const wrapper = shallow(
            <CompliancePolicies />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render emptystate', () => {
        useQuery.mockImplementation(() => ({
            data: {
                profiles: {
                    edges: []
                }
            }, error: false, loading: false }));

        const wrapper = shallow(
            <CompliancePolicies />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render an error', () => {
        const error = {
            networkError: { statusCode: 500 },
            error: 'Test Error loading'
        };
        useQuery.mockImplementation(() => ({ data: {}, error, loading: false }));
        const wrapper = shallow(
            <CompliancePolicies />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render loading', () => {
        useQuery.mockImplementation(() => ({ data: {}, error: false, loading: true }));
        const wrapper = shallow(
            <CompliancePolicies />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
