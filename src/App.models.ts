import { GradeSystem, Grade } from './components/Filters/Filters.models'

export interface Route {
    _id: number;
    link: string;
    ancestors: number[];
    name: string;
    grades: {
        [key in GradeSystem]: Grade
    };
    types: string[];
    rating?: number;
    length?: string;
    pitches?: number;
    height?: number;
}
