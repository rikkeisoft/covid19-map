import * as turf from '@turf/turf'

const createCoordinatesCircle = (center: number[], radiusInKm: number, points?: number) => {
    if (!points) points = 64
    
    let coords = {
        latitude: center[1],
        lngitude: center[0]
    }
    
    let ret = []
    let distanceX = radiusInKm / (111.320 * Math.cos(coords.latitude * Math.PI / 180))
    let distanceY = radiusInKm / 110.574
    
    let theta, x, y
    for (var i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI)
        x = distanceX * Math.cos(theta)
        y = distanceY * Math.sin(theta)
        
        ret.push([coords.lngitude + x, coords.latitude + y])
    }
    ret.push(ret[0])
    
    return [ret]
    
    return {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [ret]
                }
            }]
        }
    }
}

const getPointsInCircle = (dataPoints: any[], polygonData) => {
    const poly = turf.polygon(polygonData)
    const listPoints = []
    dataPoints.forEach((point) => {
        const pt = turf.point(point.geometry.coordinates)
        if (turf.booleanPointInPolygon(pt, poly)) {
            listPoints.push(point)
        }
    })
    return listPoints
}

export {createCoordinatesCircle, getPointsInCircle}
