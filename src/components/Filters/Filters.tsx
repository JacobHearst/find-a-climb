import React from 'react'
import { FormLabel, FormGroup, Form, FormControl } from 'react-bootstrap'
import { RangeFilterType, GradesResponse, ClimbType, Grade, RouteFilter, GradeSystem } from './Filters.models'
import axios, { AxiosResponse } from 'axios'
import _ from 'lodash'

import 'rc-slider/assets/index.css'
import './filters.css'
import RangeFilter from './RangeFilter'

export interface FiltersState {
    selectedClimbType: ClimbType;
    currentGrades: Grade[];
    grades: GradesResponse;
    filter?: RouteFilter;
}

const initialState: FiltersState = {
    currentGrades: [],
    grades: {
        yds: [],
        aid: [],
        mixed: [],
        ice: [],
        hueco: [],
        danger: [],
        snow: []
    },
    // FIXME: Configurable default grade system
    selectedClimbType: ClimbType.ROCK
}

class Filters extends React.Component<{}, FiltersState> {
    constructor(props: {}) {
        super(props)
        this.state = initialState
    }

    componentDidMount(): void {
        this.loadGrades().then((grades) => {
            this.setState({...this.state, grades}, () => this.updateGrades())
        })
    }

    render(): JSX.Element {
        return (
            <div id="filters-form-wrapper" className="mt-5">
                <h3 className="text-center">Filters:</h3>
                <Form className="mt-4">
                    <FormGroup>
                        <FormLabel>Select climb type:</FormLabel>
                        <FormControl
                            custom
                            as="select"
                            value={this.state.selectedClimbType}
                            onChange={({ target: { value }}): void => this.updateGrades(value)}>
                            {
                                Object.values(ClimbType).map((value, index) => {
                                    const key = Object.keys(ClimbType)[index]
                                    return (
                                        <option value={value} key={key}>{value}</option>
                                    )
                                })
                            }
                        </FormControl>
                    </FormGroup>
                    <RangeFilter
                        formPrefix={'Grades'}
                        filterType={RangeFilterType.GRADE}
                        min={0}
                        max={this.state.currentGrades.length - 1}
                        labels={this.state.currentGrades.map((grade) => grade.grade)}
                        onChange={_.debounce(this.updateRangeFilter, 500)}/>
                </Form>
            </div>
        )
    }

    updateRangeFilter = (filterType: RangeFilterType, values: number[]): void => {
        const filter: RouteFilter = {...this.state.filter}
        switch (filterType) {
        case RangeFilterType.GRADE:
            const gradeSystem = this.toGradeSystem(this.state.selectedClimbType)

            const gradeMin: number = this.state.currentGrades[values[0]].sort_index
            const gradeMax: number = this.state.currentGrades[values[1]].sort_index

            filter.grades = [gradeSystem, gradeMin, gradeMax].join(',')
            break
        default:
            break
        }

        this.setState({...this.state, filter})
        this.loadRoutes(filter).then((routes) => console.log(routes)).catch((error) => console.log(error))
    }

    updateGrades(selectedValue?: string): void {
        const selectedClimbType: ClimbType | undefined = selectedValue ? selectedValue as ClimbType : this.state.selectedClimbType

        if (!this.state.grades || !selectedClimbType) {
            console.log(`Grades: ${this.state.grades}`)
            console.log(`Climb Type: ${selectedClimbType}`)
            return
        }

        const currentGrades: Grade[] = this.state.grades[this.toGradeSystem(selectedClimbType)]

        this.setState({...this.state, currentGrades, selectedClimbType})
    }

    async loadGrades(): Promise<GradesResponse> {
        const response: AxiosResponse<GradesResponse> = await axios.get('http://localhost:8000/grades')

        return response.data
    }

    async loadRoutes(params?: RouteFilter): Promise<AxiosResponse> {
        console.log('Loading routes')
        const response = await axios.get('http://localhost:8000/routes/search', { params })

        return response.data
    }

    toGradeSystem(climbType: ClimbType): GradeSystem {
        const map = {
            [ClimbType.ROCK]: GradeSystem.YDS,
            [ClimbType.AID]: GradeSystem.AID,
            [ClimbType.ICE]: GradeSystem.ICE,
            [ClimbType.MIXED]: GradeSystem.MIXED,
            [ClimbType.SNOW]: GradeSystem.SNOW,
            [ClimbType.BOULDER]: GradeSystem.HUECO
        }

        return map[climbType]
    }
}

export default Filters
