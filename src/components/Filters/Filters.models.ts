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

export interface RouteFilter {
    types?: string;
    length?: string;
    pitches?: string;
    height?: string;
    rating?: string;
    elevation?: string;
    grades?: string;
}

export enum RangeFilterType {
    GRADE='GRADE',
    RATING='RATING',
    ELEVATION='ELEVATION',
    HEIGHT='HEIGHT',
    LENGTH='LENGTH',
    PITCHES='PITCHES',
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
