class FeatureObject {
    type: string;
    properties: object;
    geometry: object;

    constructor(type: string = 'Feature', properties: object = {}, geometry: object = {}) {
        this.type = type;
        this.properties = properties;
        this.geometry = geometry;
    }
}

export default FeatureObject