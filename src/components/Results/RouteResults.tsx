import React from 'react'
import { Table } from 'react-bootstrap'
import { Route } from '../../App.models'

export interface RouteResultsProps {
    routes: Route[];
}

export interface RouteResultsState {
    routes: Route[];
}

class RouteResults extends React.Component<RouteResultsProps, RouteResultsState> {
    constructor(props: RouteResultsProps) {
        super(props)
        this.state = {
            routes: []
        }
    }

    componentDidUpdate(prevProps: RouteResultsProps): void {
        if (this.props.routes !== prevProps.routes) {
            this.setState({routes: this.props.routes})
        }
    }

    render(): JSX.Element {
        if (this.state.routes.length < 1) {
            return (
                <p>Loading routes...</p>
            )
        }

        return (
            <Table responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Types</th>
                        <th>Length</th>
                        <th>Pitches</th>
                        <th>Height (ft)</th>
                        <th>Rating</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.routes.map(({ _id, name, types, rating, grades, link, pitches, length, height}) => (
                        <tr key={_id}>
                            <td>
                                <a target="blank" href={link}>{name}</a>
                            </td>
                            <td>{types.join(', ')}</td>
                            <td>{length}</td>
                            <td>{pitches}</td>
                            <td>{height}</td>
                            <td>{rating}</td>
                            <td>{Object.values(grades).map(({ grade }) => grade).join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }
}

export default RouteResults
