import { useQuery } from '@apollo/react-hooks';
import { useLocation } from 'react-router-dom';
import { onNavigate } from 'Utilities/Breadcrumbs';

import { SystemDetails } from './SystemDetails.js';

jest.mock('SmartComponents', () => ({
    InventoryDetails: () => 'MockedInventoryDetails'
}));

jest.mock('@apollo/react-hooks');

jest.mock('react-router-dom', () => ({
    ...require.requireActual('react-router-dom'),
    useHistory: jest.fn(),
    useLocation: jest.fn(),
    useParams: jest.fn(() => ({
        inventoryId: 1
    }))
}));

jest.mock('Utilities/Breadcrumbs', () => ({
    onNavigate: jest.fn()
}));

describe('SystemDetails', () => {
    const defaultLocation = {
        query: {
            hidePassed: false
        }
    };
    const data = {
        system: {
            name: 'test.host.local'
        }
    };
    const defaultQuery = {
        data, error: false, loading: false
    };

    beforeEach(() => {
        useLocation.mockImplementation(jest.fn(() => defaultLocation));
        useQuery.mockImplementation(() => defaultQuery);
    });

    it('expect to render without error', () => {
        const wrapper = shallow(
            <SystemDetails />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to call onNavigate on breadcrumb click', () => {
        const wrapper = shallow(
            <SystemDetails />
        );
        wrapper.find('BreadcrumbItem[to="/rhel/compliance/systems"]').simulate('click');
        expect(onNavigate).toHaveBeenCalled();
    });

    it('expect to render loading', () => {
        useQuery.mockImplementation(() => ({ ...defaultQuery, loading: true }));
        const wrapper = shallow(
            <SystemDetails />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render and pass hidePassed correctly', () => {
        useLocation.mockImplementation(() => ({ query: { hidePassed: true } }));
        const wrapper = shallow(
            <SystemDetails />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render a 500 error', () => {
        const error = {
            networkError: { statusCode: 500 },
            error: 'Test Error loading'
        };
        useQuery.mockImplementation(() => ({ ...defaultQuery, error }));
        const wrapper = shallow(
            <SystemDetails />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
