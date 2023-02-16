import { Feature } from "ol";
import { Geometry, Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { IFeature } from "./i-feature.dto";

export class PointFeature implements IFeature {
    name!: string;
    data: any = {};
    latitude!: number;
    longitude!: number;

    private feature?: Feature;

    constructor(name: string, latitude: number, longitude: number, data: any = {}) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.data = data;
    }

    getFeature(): Feature<Geometry> {
        this.feature = new Feature(new Point(fromLonLat([this.longitude, this.latitude])))
        this.feature.set('data', this.data);
        return this.feature
    }
}