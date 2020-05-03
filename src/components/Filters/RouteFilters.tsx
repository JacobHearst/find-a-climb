import React from 'react'
import { Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap'
import { ClimbType, RangeFilterType, GradesResponse, RouteFilter, GradeSystem, RouteFilterData, RouteFiltersResponse } from './Filters.models'
import RangeFilter from './RangeFilter'
import _ from 'lodash'

export interface RouteFiltersProps {
    onFilterUpdate: (filter: RouteFilter) => void;
    filterData: RouteFilterData;
}

export interface RouteFiltersState {
    selectedClimbType: ClimbType;
    grades: GradesResponse;
    filterData: RouteFiltersResponse;
    filter: RouteFilter;
}

const initialState: RouteFiltersState = {
    grades: {} as GradesResponse,
    filterData: {} as RouteFiltersResponse,
    filter: {},
    // FIXME: Configurable default grade system
    selectedClimbType: ClimbType.ROCK
}

class RouteFilters extends React.Component<RouteFiltersProps, RouteFiltersState> {
    constructor(props: RouteFiltersProps) {
        super(props)
        this.state = initialState
    }

    static getDerivedStateFromProps({ filterData }: RouteFiltersProps, state: RouteFiltersState): RouteFiltersState | null {
        if (!_.isEmpty(filterData)) {
            const { grades } = filterData
            const gradeSystem = RouteFilters.toGradeSystem(state.selectedClimbType)

            const newState: RouteFiltersState = {
                ...state,
                grades,
                filterData: {
                    ...filterData.filters,
                    grade: grades[gradeSystem].map((grade) => grade.grade)
                }
            }

            return newState
        }

        return null
    }

    /**
     * Render the route search filters
     */
    render(): JSX.Element {
        const filters = !_.isEmpty(this.state.filterData) 
            ? _.map(this.state.filterData, (filterValues, key) => {
                return (
                    <RangeFilter
                        key={key}
                        filterType={key as RangeFilterType}
                        min={0}
                        max={filterValues.length - 1}
                        labels={filterValues}
                        units={this.getFilterUnits(key as RangeFilterType)}
                        onChange={_.debounce(this.updateRangeFilter, 500)}/>
                )
            })
            : (<p>Loading filters...</p>)

        return (
            <Form>
                <FormGroup>
                    <FormLabel>Select climb type:</FormLabel>
                    <FormControl
                        custom
                        as="select"
                        value={this.state.selectedClimbType}
                        onChange={({ target: { value } }): void => this.updateGradeSystem(value)}>
                        <option value={ClimbType.ROCK}>{ClimbType.ROCK}</option>
                        <option value={ClimbType.BOULDER}>{ClimbType.BOULDER}</option>
                        <option value={ClimbType.AID}>{ClimbType.AID}</option>
                        <option value={ClimbType.ICE}>{ClimbType.ICE}</option>
                        <option value={ClimbType.MIXED}>{ClimbType.MIXED}</option>
                        <option value={ClimbType.SNOW}>{ClimbType.SNOW}</option>
                    </FormControl>
                </FormGroup>
                {filters}
            </Form>
        )
    }

    /**
     * Update a range-based filter value
     * 
     * @param filterType The type of range filter having its value updated
     * @param values The updated range value
     */
    updateRangeFilter = (filterType: RangeFilterType, values: number[]): void => {
        const filter: RouteFilter = {}
        switch (filterType) {
        case RangeFilterType.GRADE:
            const gradeSystem = RouteFilters.toGradeSystem(this.state.selectedClimbType)
            const grades = this.state.grades[gradeSystem]

            const gradeMin: number = grades[values[0]].sort_index
            const gradeMax: number = grades[values[1]].sort_index

            filter.grades = [gradeSystem, gradeMin, gradeMax].join(',')
            break
        case RangeFilterType.RATING:
            filter.rating = values.join(',')
            break
        case RangeFilterType.LENGTH:
            const lengthMin = this.state.filterData.length[values[0]]
            const lengthMax = this.state.filterData.length[values[1]]
            filter.length = [lengthMin, lengthMax].join(',')
            break
        case RangeFilterType.PITCHES:
            filter.pitches = values.join(',')
            break
        case RangeFilterType.HEIGHT:
            filter.height = values.join(',')
            break
        default:
            break
        }

        Object.assign(filter, this.state.filter)
        this.setState({filter})
        this.props.onFilterUpdate(filter)
    }

    /**
     * Update the grade system being used for the grade selector
     * @param selectedValue Newly selected climbing type
     */
    updateGradeSystem(selectedValue?: string): void {
        const selectedClimbType: ClimbType | undefined = selectedValue ? selectedValue as ClimbType : this.state.selectedClimbType

        if (!this.state.grades || !selectedClimbType) {
            console.warn('Caught empty value')
            console.log(`Grades: ${this.state.grades}`)
            console.log(`Climb Type: ${selectedClimbType}`)
            return
        }

        const grades: string[] = this.state.grades[RouteFilters.toGradeSystem(selectedClimbType)].map((grade) => grade.grade)

        this.setState({ filterData: { ...this.state.filterData, grade: grades}, selectedClimbType })
    }

    /**
     * Get the grade system for the specified type of climbing
     * @param climbType Type of climbing to determine grade system for
     */
    static toGradeSystem(climbType: ClimbType): GradeSystem {
        return {
            [ClimbType.ROCK]: GradeSystem.YDS,
            [ClimbType.AID]: GradeSystem.AID,
            [ClimbType.ICE]: GradeSystem.ICE,
            [ClimbType.MIXED]: GradeSystem.MIXED,
            [ClimbType.SNOW]: GradeSystem.SNOW,
            [ClimbType.BOULDER]: GradeSystem.HUECO
        }[climbType]
    }

    getFilterUnits(filterType: RangeFilterType): string {
        if (filterType === RangeFilterType.HEIGHT) {
            return 'ft'
        } else if (filterType === RangeFilterType.RATING) {
            return 'stars'
        }
        
        return ''
    }
}

export default RouteFilters
