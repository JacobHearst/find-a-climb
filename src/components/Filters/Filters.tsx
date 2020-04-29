import React from 'react'
import { FormLabel, FormGroup, Form, FormControl } from 'react-bootstrap'
import { FiltersState, Grade, RangeFilterType } from './Filters.models'
import axios, { AxiosResponse } from 'axios'

import 'rc-slider/assets/index.css'
import './filters.css'
import RangeFilter from './RangeFilter'

const initialState: FiltersState = {
    grades: [],
    filterUpdates: {}
}

class Filters extends React.Component<{}, FiltersState> {
    constructor(props: {}) {
        super(props)
        this.state = initialState
    }

    componentDidMount(): void {
        this.loadGrades().then((grades) => this.setState({ grades }))
    }

    render(): JSX.Element {
        return (
            <div id="filters-form-wrapper" className="mt-5">
                <h3 className="text-center">Filters:</h3>
                <Form className="mt-4">
                    <FormGroup>
                        <FormLabel>Select climb type:</FormLabel>
                        <FormControl as="select" custom>
                            <option>Sport</option>
                            <option>Trad</option>
                            <option>Boulder</option>
                            <option>Ice</option>
                            <option>Mixed</option>
                            <option>Aid</option>
                        </FormControl>
                    </FormGroup>
                    <RangeFilter
                        formPrefix={'Grades'}
                        filterType={RangeFilterType.GRADE}
                        min={0}
                        max={this.state.grades.length - 1}
                        labels={this.state.grades.map((grade) => grade.grade)}
                        onChange={this.updateRangeFilter}/>
                </Form>
            </div>
        )
    }

    updateRangeFilter(filterName: RangeFilterType, values: number[]): void {
        switch (filterName) {
        case RangeFilterType.GRADE:
            // console.log(values)
            // this.setState({...this.state, grades: value})
            break
        default:
            break
        }
    }

    async loadGrades(): Promise<Grade[]> {
        const response: AxiosResponse<Grade[]> = await axios.get('http://localhost:8000/routes/grades/yds')

        return response.data
    }
}

export default Filters
