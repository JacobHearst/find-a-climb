import React from 'react'
import { RouteFilter, ResourceType, RouteFilterData, GradesResponse, RouteFiltersResponse } from './Filters.models'
import RouteFilters from './RouteFilters'
import { ListGroup, Tab } from 'react-bootstrap'
import AreaFilters from './AreaFilters'
import axios, { AxiosResponse } from 'axios'

import 'rc-slider/assets/index.css'
import './filters.css'

export interface FiltersProps {
    onFilterUpdate: (resourceType: ResourceType, filter: RouteFilter) => void;
}

export interface FiltersState {
    filter?: RouteFilter;
    routeFilterData: RouteFilterData;
    selectedSearchType: ResourceType;
}

const initialState: FiltersState = {
    selectedSearchType: ResourceType.ROUTE,
    routeFilterData: {} as RouteFilterData
}

class Filters extends React.Component<FiltersProps, FiltersState> {
    constructor(props: FiltersProps) {
        super(props)
        this.state = initialState
    }

    componentDidMount(): void {
        this.loadRouteFilterData().then((routeFilterData) => this.setState({ routeFilterData }))
    }

    render(): JSX.Element {
        return (
            <div id="filters-form-wrapper" className="mt-4">
                <h3 className="text-center mb-4">Search by:</h3>
                <Tab.Container defaultActiveKey="#routes">
                    <ListGroup horizontal={'md'} className="text-center">
                        <ListGroup.Item action href="#routes" onClick={(): void => this.setSelectedSearch(ResourceType.ROUTE)}>
                            Route
                        </ListGroup.Item>
                        <ListGroup.Item action href="#areas" onClick={(): void => this.setSelectedSearch(ResourceType.AREA)}>
                            Area
                        </ListGroup.Item>
                    </ListGroup>
                </Tab.Container>
                <div className="mt-4">
                    {
                        this.state.selectedSearchType === ResourceType.ROUTE
                            ? (<RouteFilters onFilterUpdate={this.onRouteChange} filterData={this.state.routeFilterData} />)
                            : (<AreaFilters/>)
                    }
                </div>
            </div>
        )
    }

    onRouteChange = (filter: RouteFilter): void => this.props.onFilterUpdate(ResourceType.ROUTE, filter)

    // TODO: onAreaChange

    setSelectedSearch(resourceType: ResourceType): void {
        this.setState({ selectedSearchType: resourceType })
    }

    async loadRouteFilterData(): Promise<RouteFilterData> {
        const gradesResponse: AxiosResponse<GradesResponse> = await axios.get('http://localhost:8000/grades')
        const filtersResponse: AxiosResponse<RouteFiltersResponse> = await axios.get('http://localhost:8000/routes/filters')

        return {
            grades: gradesResponse.data,
            filters: filtersResponse.data
        }
    }
}

export default Filters
