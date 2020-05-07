import React from 'react'
import { InputGroup, FormLabel } from 'react-bootstrap'
import { Range } from 'rc-slider'
import { RouteFilterType } from './Filters.models'
import _ from 'lodash'

export interface RangeFilterProps {
    labels: string[];
    units: string;
    filterType: RouteFilterType;
    min: number;
    max: number;
    onChange: (filterName: RouteFilterType, values: string[]) => void;
}

export interface RangeFilterState {
    values: number[];
    formLabel: string;
    min: number;
    max: number;
}

class RangeFilter extends React.Component<RangeFilterProps, RangeFilterState> {
    constructor(props: RangeFilterProps) {
        super(props)
        const { filterType, min, max, labels, units } = props
        this.state = {
            formLabel: this.generateLabel(filterType, min, max, labels, units),
            values: [min, max],
            min,
            max
        }
    }

    componentDidUpdate(prevProps: RangeFilterProps): void {
        if (!_.isEqual(this.props, prevProps)) {
            const { filterType, min, max, labels, units } = this.props
            this.setState({
                formLabel: this.generateLabel(filterType, min, max, labels, units),
                values: [min, max],
                min,
                max
            })
        }
    }

    render(): JSX.Element {
        return (
            <InputGroup>
                <FormLabel>{this.state.formLabel}</FormLabel>
                <Range
                    allowCross={false}
                    value={this.state.values}
                    min={this.state.min}
                    max={this.state.max}
                    onChange={this.updateValues} />
            </InputGroup>
        )
    }

    updateValues = (labelIndices: number[]): void => {
        this.setState({
            values: labelIndices,
            formLabel: this.generateLabel(this.props.filterType, labelIndices[0], labelIndices[1], this.props.labels, this.props.units)
        })

        // Convert from the index of the label to the value itself
        const values: string[] = [this.props.labels[labelIndices[0]], this.props.labels[labelIndices[1]]]

        this.props.onChange(this.props.filterType, values)
    }

    generateLabel(filterType: RouteFilterType, lowerBound: number, upperBound: number, labels: string[], units: string): string {
        // Capitalize first letter, will be removed when translation is added
        const prefix = filterType[0].toUpperCase() + filterType.slice(1)
        return `${prefix}: ${labels[lowerBound]} / ${labels[upperBound]} ${units}`
    }
}

export default RangeFilter
