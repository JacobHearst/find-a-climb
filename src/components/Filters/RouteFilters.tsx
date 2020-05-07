import React from 'react'
import { Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap'
import { ClimbType, RouteFilterType, GradesResponse, RouteFilter, GradeSystem, RouteFilterData, RouteFiltersResponse } from './Filters.models'
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

class RouteFilters extends React.Component<RouteFiltersProps, RouteFiltersState> {
    constructor(props: RouteFiltersProps) {
        super(props)

        const defaultClimbType = ClimbType.ROCK
        const { filterData: { grades, filters }} = props
        const gradeSystem = this.toGradeSystem(defaultClimbType)

        this.state = {
            grades,
            filterData: {
                ...filters,
                grade: grades[gradeSystem].map((grade) => grade.grade)
            },
            filter: {},
            selectedClimbType: defaultClimbType
        }

        this.shouldAddToFilter = this.shouldAddToFilter.bind(this)
    }

    shouldComponentUpdate(_nextProps: RouteFiltersProps, nextState: RouteFiltersState): boolean {
        const currState = _.omit(this.state, 'filter')
        const newState = _.omit(nextState, 'filter')

        return !_.isEqual(currState, newState)
    }

    componentDidMount(): void {
        this.updateFilter(RouteFilterType.TYPES, [this.state.selectedClimbType])
    }

    /**
     * Render the route search filters
     */
    render(): JSX.Element {
        return (
            <Form>
                <FormGroup>
                    <FormLabel>Select climb type:</FormLabel>
                    <FormControl
                        custom
                        as="select"
                        value={this.state.selectedClimbType}
                        onChange={({ target: { value } }): void => this.updateFilter(RouteFilterType.TYPES, [value])}>
                        <option value={ClimbType.ROCK}>{ClimbType.ROCK}</option>
                        <option value={ClimbType.BOULDER}>{ClimbType.BOULDER}</option>
                        <option value={ClimbType.AID}>{ClimbType.AID}</option>
                        <option value={ClimbType.ICE}>{ClimbType.ICE}</option>
                        <option value={ClimbType.MIXED}>{ClimbType.MIXED}</option>
                        <option value={ClimbType.SNOW}>{ClimbType.SNOW}</option>
                    </FormControl>
                </FormGroup>
                {_.map(this.state.filterData, (filterValues, key) => (
                    <RangeFilter
                        key={key}
                        filterType={key as RouteFilterType}
                        min={0}
                        max={filterValues.length - 1}
                        labels={filterValues as string[]}
                        units={this.getFilterUnits(key as RouteFilterType)}
                        onChange={_.debounce(this.updateFilter, 500)} />
                ))}
            </Form>
        )
    }

    /**
     * Update a range-based filter value
     * 
     * @param filterType The type of range filter having its value updated
     * @param values The updated range value
     */
    updateFilter = (filterType: RouteFilterType, values: string[]): void => {
        const newFilterValues: RouteFilter = {}
        switch (filterType) {
        case RouteFilterType.GRADE: {
            const gradeSystem = this.toGradeSystem(this.state.selectedClimbType)
            const grades = this.state.grades[gradeSystem]

            const gradeMin = _.find(grades, { grade: values[0] })?.sort_index
            const gradeMax = _.find(grades, { grade: values[1] })?.sort_index

            newFilterValues.grade = [gradeSystem, gradeMin, gradeMax].join(',')
            break
        }
        case RouteFilterType.RATING:
            newFilterValues.rating = values.join(',')
            break
        case RouteFilterType.LENGTH:
            newFilterValues.length = values.join(',')
            break
        case RouteFilterType.PITCHES:
            newFilterValues.pitches = values.join(',')
            break
        case RouteFilterType.HEIGHT:
            newFilterValues.height = values.join(',')
            break
        case RouteFilterType.TYPES: {
            const selectedClimbType = values[0] as ClimbType
            
            // Update selected grade system
            const newGradeSystem = this.state.grades[this.toGradeSystem(selectedClimbType)].map((grade) => grade.grade)
            this.setState({ filterData: { ...this.state.filterData, grade: newGradeSystem }, selectedClimbType })

            const climbTypes = selectedClimbType === ClimbType.ROCK
                ? ['Trad', 'Sport']
                : [selectedClimbType]

            newFilterValues.types = climbTypes.join(',')
            break
        }
        default:
            break
        }

        const filter = _.pickBy(Object.assign({}, this.state.filter, newFilterValues), this.shouldAddToFilter)
        this.setState({filter})
        this.props.onFilterUpdate(filter)
    }

    /**
     * Get the grade system for the specified type of climbing
     * 
     * @param climbType Type of climbing to determine grade system for
     */
    toGradeSystem(climbType: ClimbType): GradeSystem {
        return {
            [ClimbType.ROCK]: GradeSystem.YDS,
            [ClimbType.AID]: GradeSystem.AID,
            [ClimbType.ICE]: GradeSystem.ICE,
            [ClimbType.MIXED]: GradeSystem.MIXED,
            [ClimbType.SNOW]: GradeSystem.SNOW,
            [ClimbType.BOULDER]: GradeSystem.HUECO
        }[climbType]
    }

    /**
     * Get the units for a given filter type. This is a
     * pretty hacky solution right now, but since I'm not
     * supporting translation yet I can live with it
     * 
     * @param filterType type of filter to get units for
     */
    getFilterUnits(filterType: RouteFilterType): string {
        if (filterType === RouteFilterType.HEIGHT) {
            return 'ft'
        } else if (filterType === RouteFilterType.RATING) {
            return 'stars'
        }
        
        return ''
    }

    /**
     * Determine if a value for a given RouteFilterType should be added
     * to the filter. This is determined by comparing the selected values
     * to the min and max possible values of the filter with one exception.
     * The Types filter always returns true because we always want to filter
     * by the type
     *
     * @param value value to be added
     * @param key key of value to check
     */
    shouldAddToFilter(value: string | undefined, key: string): boolean {
        if ((key as RouteFilterType) === RouteFilterType.TYPES) {
            return true
        } 

        const currFilterData = this.state.filterData[key as RouteFilterType]
        if (!currFilterData || !value) {
            return false
        }

        let filterMinMax = [currFilterData[0].toString(), currFilterData.slice(-1)[0].toString()]
        if ((key as RouteFilterType) === RouteFilterType.GRADE) {
            // Grades are filtered by their sort index, not their grade value. 
            const gradeSystem = this.toGradeSystem(this.state.selectedClimbType)

            const min = _.find(this.state.grades[gradeSystem], { grade: currFilterData[0] })?.sort_index.toString()
            const max = _.find(this.state.grades[gradeSystem], { grade: currFilterData.slice(-1)[0] })?.sort_index.toString()
            filterMinMax = [this.toGradeSystem(this.state.selectedClimbType), min ? min : '', max ? max : '']
        }

        const values = value.split(',')

        // Filter by min/max
        const result = !_.isEqual(values, filterMinMax)
        return result
    }
}

export default RouteFilters
