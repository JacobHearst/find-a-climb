import React from 'react'
import Filters from './components/Filters/Filters'
import { Container, Row, Col } from 'react-bootstrap'
import { RouteFilter, ResourceType } from './components/Filters/Filters.models'
import Axios from 'axios'
import { PagedRouteResults } from './App.models'

import './App.css'
import RouteResults from './components/Results/RouteResults'

export interface AppState {
    routeResults?: PagedRouteResults;
    filters?: object;
}

class App extends React.Component<object, AppState> {
    constructor(props: object) {
        super(props)
        this.state = {}

        this.search = this.search.bind(this)
    }

    render(): JSX.Element {
        return (
            <Container fluid>
                <h1 className="text-center">Find a Climb</h1>
                <Row>
                    <Col id="filters-col" md={2}>
                        <Filters onFilterUpdate={this.search} />
                    </Col>
                    <Col md={10} id="results-col">
                        <RouteResults
                            results={this.state.routeResults ? this.state.routeResults : {} as PagedRouteResults}
                            onPage={this.onPage}/>
                    </Col>
                </Row>
            </Container>
        )
    }

    search(resourceType: ResourceType, filters: RouteFilter): void {
        this.setState({ filters })
        Axios.get(`http://localhost:8000/${resourceType}/search`, { params: filters })
            .then(({ data }) => this.setState({routeResults: data}))
    }

    onPage(pageNum: number): void {
        console.log(pageNum)
    }
}

export default App
