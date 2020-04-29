import React from 'react'
import Filters from './components/Filters/Filters'
import { Container, Row, Col } from 'react-bootstrap'

import './App.css'

class App extends React.Component {
    render(): JSX.Element {
        return (
            <Container fluid>
                <h1 className="text-center">Find a Climb</h1>
                <Row>
                    <Col id="filters-col" md={2}>
                        <Filters />
                    </Col>
                    <Col md={10} id="results-col">
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default App
