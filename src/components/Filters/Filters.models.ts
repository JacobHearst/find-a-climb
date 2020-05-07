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
    [key in RouteFilterType]: string[]
}

export interface RouteFilter {
    types?: string;
    length?: string;
    pitches?: string;
    height?: string;
    rating?: string;
    grade?: string;
}

export interface RouteFilterData {
    grades: GradesResponse;
    filters: RouteFiltersResponse;
}

export enum RouteFilterType {
    GRADE='grade',
    RATING='rating',
    HEIGHT='height',
    LENGTH='length',
    PITCHES='pitches',
    TYPES='types'
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
