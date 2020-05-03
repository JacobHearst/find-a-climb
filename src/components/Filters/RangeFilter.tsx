import React from 'react'
import { InputGroup, FormLabel } from 'react-bootstrap'
import { Range } from 'rc-slider'
import { RangeFilterType } from './Filters.models'

export interface RangeFilterProps {
    labels: string[];
    units: string;
    filterType: RangeFilterType;
    min: number;
    max: number;
    onChange: (filterName: RangeFilterType, value: number[]) => void;
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
        this.state = {
            values: [],
            formLabel: '',
            min: 0,
            max: 100
        }
    }

    static getDerivedStateFromProps({ filterType, min, max, labels, units}: RangeFilterProps, state: RangeFilterState): RangeFilterState | null {
        if (max > 0 && state.max !== max) {
            const newState: RangeFilterState = {
                formLabel: RangeFilter.generateLabel(filterType, min, max, labels, units),
                values: [min, max],
                min,
                max
            }

            return newState
        }

        return null
    }

    render(): JSX.Element {
        if (this.props.max < 0) {
            return (
                <p>Loading...</p>
            )
        }

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

    updateValues = (values: number[]): void => {
        this.setState({
            values,
            formLabel: RangeFilter.generateLabel(this.props.filterType, values[0], values[1], this.props.labels, this.props.units)
        })

        this.props.onChange(this.props.filterType, values)
    }

    static generateLabel(filterType: RangeFilterType, lowerBound: number, upperBound: number, labels: string[], units: string): string {
        const prefix = filterType[0].toUpperCase() + filterType.slice(1)
        return `${prefix}: ${labels[lowerBound]} / ${labels[upperBound]} ${units}`
    }
}

export default RangeFilter
