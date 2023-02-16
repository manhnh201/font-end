import { Feature } from "ol";

export interface IFeature {
    name: string;
    data: any;
    getFeature(): Feature;
}