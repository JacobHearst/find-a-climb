import React from 'react'
import Filters from './components/Filters/Filters'
import { Container, Row, Col } from 'react-bootstrap'
import { RouteFilter, ResourceType } from './components/Filters/Filters.models'
import Axios from 'axios'
import { Route } from './App.models'

import './App.css'

export interface AppState {
    routeResults?: Route[];
}

class App extends React.Component<{}> {
    render(): JSX.Element {
        return (
            <Container fluid>
                <h1 className="text-center">Find a Climb</h1>
                <Row>
                    <Col id="filters-col" md={2}>
                        <Filters onFilterUpdate={this.search} />
                    </Col>
                    <Col md={10} id="results-col">
                    </Col>
                </Row>
            </Container>
        )
    }

    search(resourceType: ResourceType, filters: RouteFilter): void {
        Axios.get(`http://localhost:8000/${resourceType}/search`, { params: filters })
            .then(({ data }) => this.setState({routeResults: data}))
    }
}

export default App
