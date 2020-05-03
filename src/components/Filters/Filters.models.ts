export interface Grade {
    grade: string;
    sort_index: number;
}

export interface GradesResponse {
    yds: Grade[];
    aid: Grade[];
    mixed: Grade[];
    ice: Grade[];
    hueco: Grade[];
    danger: Grade[];
    snow: Grade[];
}

export type RouteFiltersResponse = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in RangeFilterType]: any[]
}

export interface RouteFilter {
    types?: string;
    length?: string;
    pitches?: string;
    height?: string;
    rating?: string;
    elevation?: string;
    grades?: string;
}

export interface RouteFilterData {
    grades: GradesResponse;
    filters: RouteFiltersResponse;
}

export enum RangeFilterType {
    GRADE='grade',
    RATING='rating',
    HEIGHT='height',
    LENGTH='length',
    PITCHES='pitches',
}

export enum ClimbType {
    ROCK='Rock',
    AID='Aid',
    MIXED='Mixed',
    ICE='Ice',
    SNOW='Snow',
    BOULDER='Boulder'
}

export enum GradeSystem {
    YDS='yds',
    AID='aid',
    ICE='ice',
    MIXED='mixed',
    SNOW='snow',
    DANGER='danger',
    HUECO='hueco'
}

export enum ResourceType {
    AREA='areas',
    ROUTE='routes'
}
