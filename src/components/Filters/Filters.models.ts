export interface Grade {
    grade: string;
    sort_index: number;
}

export interface FiltersState {
    grades: Grade[];
    filterUpdates: unknown;
}

export enum RangeFilterType {
    GRADE = 'Grade'
}

export enum ClimbType {
    SPORT='Sport',
    TRAD='Trad',
    AID='Aid',
    MIXED='Mixed',
    ICE='Ice',
    BOULDER='Boulder'
}
