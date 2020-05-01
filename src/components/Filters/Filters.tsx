import React from 'react'
import { RouteFilter, ResourceType } from './Filters.models'

import 'rc-slider/assets/index.css'
import './filters.css'
import RouteFilters from './RouteFilters'

export interface FiltersProps {
    onFilterUpdate: (resourceType: ResourceType, filter: RouteFilter) => void;
}

export interface FiltersState {
    filter?: RouteFilter;
}

const initialState: FiltersState = {}

class Filters extends React.Component<FiltersProps, FiltersState> {
    constructor(props: FiltersProps) {
        super(props)
        this.state = initialState
    }

    render(): JSX.Element {
        return (
            <div id="filters-form-wrapper" className="mt-5">
                <h3 className="text-center">Filters:</h3>
                <RouteFilters onFilterUpdate={this.onRouteChange}/>
            </div>
        )
    }

    onRouteChange = (filter: RouteFilter): void => this.props.onFilterUpdate(ResourceType.ROUTE, filter)

    // TODO: onAreaChange
}

export default Filters
