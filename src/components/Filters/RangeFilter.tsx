import React from 'react'
import { InputGroup, FormLabel } from 'react-bootstrap'
import { Range } from 'rc-slider'
import { RangeFilterType } from './Filters.models'

export interface RangeFilterProps {
    labels: string[];
    formPrefix: string;
    filterType: RangeFilterType;
    min: number;
    max: number;
    onChange: (filterName: RangeFilterType, value: number[]) => void;
}

export interface RangeFilterState {
    selectedValues: number[];
    formLabel: string;
}

class RangeFilter extends React.Component<RangeFilterProps, RangeFilterState> {
    constructor(props: RangeFilterProps) {
        super(props)
        this.state = {
            selectedValues: [],
            formLabel: ''
        }
    }

    static getDerivedStateFromProps(props: RangeFilterProps, state: RangeFilterState): RangeFilterState {
        if (state.formLabel === '') {
            if (props.max > 0) {
                return {
                    ...state,
                    formLabel: `${props.formPrefix}: ${props.labels[props.min]} - ${props.labels[props.max]}`
                }
            }
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
                    defaultValue={[this.props.min, this.props.max]}
                    min={this.props.min}
                    max={this.props.max}
                    onChange={this.updateValues} />
            </InputGroup>
        )
    }

    updateValues = (selectedValues: number[]): void => {
        this.setState({
            ...this.state,
            selectedValues,
            formLabel: `${this.props.formPrefix}: ${this.props.labels[selectedValues[0]]} - ${this.props.labels[selectedValues[1]]}`
        })

        this.props.onChange(this.props.filterType, selectedValues)
    }
}

export default RangeFilter
