import React from 'react'
import { Table, Pagination } from 'react-bootstrap'
import { Route, PagedRouteResults } from '../../App.models'

export interface RouteResultsProps {
    results: PagedRouteResults;
    onPage: (pageNum: number) => void;
}

export interface RouteResultsState {
    routes: Route[];
    page: number;
}

class RouteResults extends React.Component<RouteResultsProps, RouteResultsState> {
    constructor(props: RouteResultsProps) {
        super(props)
        this.state = {
            routes: [],
            page: 1
        }

        this.page = this.page.bind(this)
        this.paginationItems = this.paginationItems.bind(this)
    }

    componentDidUpdate(prevProps: RouteResultsProps): void {
        if (this.props.results !== prevProps.results) {
            this.setState({routes: this.props.results.routes, page: 1})
        }
    }

    render(): JSX.Element {
        if (!this.state.routes || this.state.routes.length < 1) {
            return (
                <p>Loading routes...</p>
            )
        }

        return (
            <div>
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
                <Pagination className="justify-content-center">
                    <Pagination.First
                        disabled={this.state.page === 1}
                        onClick={(): void => this.page(1)}/>
                    <Pagination.Prev 
                        disabled={this.state.page - 1 === 0}
                        onClick={(): void => this.page(this.state.page - 1)}/>
                    {this.paginationItems()}
                    <Pagination.Next
                        disabled={this.state.page + 1 > this.props.results.maxPage}
                        onClick={(): void => this.page(this.state.page + 1)}/>
                    <Pagination.Last
                        disabled={this.state.page === this.props.results.maxPage}
                        onClick={(): void => this.page(this.props.results.maxPage)} />
                </Pagination>
            </div>
        )
    }

    /**
     * Generate pagination items for the current search results
     */
    paginationItems(): JSX.Element[] {
        const { results: { maxPage } } = this.props
        const paginationItems = []

        // Ensure that at least 10 items are shown whenever max page is >= 10
        let startPage = maxPage - this.state.page < 10
            ? maxPage - 9
            : this.state.page
        
        // Generate starting at 1 if there are fewer than 10 pages
        if (maxPage < 10) {
            startPage = 1
        }

        // Create 10 pagination buttons
        for (let i = startPage; i <= startPage + 9 && i <= maxPage; i++) {
            paginationItems.push(
                <Pagination.Item
                    active={i === this.state.page}
                    key={i}
                    onClick={(): void => this.page(i)}>{i}</Pagination.Item>
            )
        }

        return paginationItems
    }

    /**
     * 
     * @param page The page number to navigate to
     */
    page(page: number): void {
        // console.log(page)
        this.setState({ page })
    }
}

export default RouteResults
