import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import AutoCompletePlace from "../components/commons/AutoCompletePlace"
import Stepper from "../components/commons/Stepper"
import CheckboxInput from "../components/commons/CheckboxInput"
import FeatureObject from '../models/FeatureObject'
import * as CONSTANTS from '../ultils/Constant'
import * as MapboxGl from '../ultils/MapboxGl'
import * as Helper from '../ultils/Helper'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

interface MapData {
    lat: any,
    lng: any,
    zoom: any,
}

interface Geometry {
    type: String,
    coordinates: any[],
}

interface User {
    name: string,
    address: string,
    lat: number,
    lng: number,
    patientGroup: string,
    note: string,
    verifyDate: string,
}

const DEFAULT_RADIUS = 5

let map: any = null
let marker: any = null
let radius = DEFAULT_RADIUS
let listPointsInCircle: any = []
let dataPoints = []
const Index = () => {
    const mapContainer = useRef<HTMLDivElement>();
    const mapData = { lat:  21.033702, lng: 105.833916, zoom: 11.25 }
    const [showAllPoint, setShowAllPoint] = useState<Boolean>(true)
    const dateVerifyData = Helper.getDay(new Date())
    
    useEffect(() => {
        const setMap = () => {
            dataPoints = getCollectionsData()
            map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [mapData.lng, mapData.lat],
                zoom: CONSTANTS.DEFAULT_ZOOM
            })
    
            map.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    fitBoundsOptions: {
                        maxZoom: 13
                    },
                    trackUserLocation: true,
                }),
                'bottom-right'
            )
    
            const size = 100;
    
            const pulsingDot = {
                width: size,
                height: size,
                data: new Uint8Array(size * size * 4),

                onAdd: function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    this.context = canvas.getContext('2d');
                },

                render: function() {
                    const duration = 1000;
                    const t = (performance.now() % duration) / duration;
    
                    const radius = (size / 2) * 0.3;
                    const outerRadius = (size / 2) * 0.7 * t + radius;
                    const context = this.context;

                    context.clearRect(0, 0, this.width, this.height);
                    context.beginPath();
                    context.arc(
                        this.width / 2,
                        this.height / 2,
                        outerRadius,
                        0,
                        Math.PI * 2
                    );
                    context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
                    context.fill();

                    context.beginPath();
                    context.arc(
                        this.width / 2,
                        this.height / 2,
                        radius,
                        0,
                        Math.PI * 2
                    );
                    context.fillStyle = 'rgba(255, 100, 100, 1)';
                    context.strokeStyle = 'white';
                    context.lineWidth = 2 + 4 * (1 - t);
                    context.fill();
                    context.stroke();

                    this.data = context.getImageData(
                        0,
                        0,
                        this.width,
                        this.height
                    ).data;

                    map.triggerRepaint();

                    return true;
                }
            };

            map.on('load', function() {
                map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
                
                map.addSource('places', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: dataPoints
                    }
                });

                map.addLayer({
                    id: 'places',
                    type: 'symbol',
                    source: 'places',
                    layout: {
                        'icon-image': 'pulsing-dot',
                    }
                });
            })

            map.on('click', 'places', function(e) {
                let coordinates = (e.features[0].geometry as Geometry).coordinates.slice() as any;
                let description = e.features[0].properties.description;

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map);
            });

            map.on('mouseenter', 'places', function() {
                map.getCanvas().style.cursor = 'pointer';
            });
        
            map.on('mouseleave', 'places', function() {
                map.getCanvas().style.cursor = '';
            });
        }
        
        setMap()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const getCollectionsData = () => {
        let listPoints = []
        CONSTANTS.DEFAULT_DATA.map((user: User) => {
            const featureObject = new FeatureObject()
            featureObject.geometry = {
                type: 'Point',
                coordinates: [user.lng, user.lat]
            }
            
            let description = '';
            description += '<strong>' + user.name + ' - ' + '<span class="color-info">' + user.patientGroup +'</span></strong><br />'
            description += '<strong> Địa chỉ: </strong>' + user.address + '<br />'
            description += '<strong> Lịch sử di chuyển: </strong>' + user.note + '<br />'
            

            featureObject.properties = {
                description: description,
            }
    
            listPoints.push(featureObject)
        })
        return listPoints
    }

    getCollectionsData()
    
    const onSelectPosition = (values: any) => {
        const coordinates = [values.lng, values.lat]
        const coordinatesCircleData = MapboxGl.createCoordinatesCircle(coordinates, radius)
        if (marker) {
            marker.remove()
            map.getSource('polygon').setData({
                'type': 'Polygon',
                'coordinates': coordinatesCircleData
            });
        } else {
            map.addSource("polygon", {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: coordinatesCircleData
                        }
                    }]
                }
            });
            
            map.addLayer({
                id: 'drawMaker',
                type: 'fill',
                source: 'polygon',
                layout: {},
                'fill-color': '#007cbf',
                paint: {
                    'fill-opacity': 0.2
                }
            });
        }
        marker = new mapboxgl.Marker()
        marker.setLngLat(coordinates)
        marker.addTo(map);
        map.setZoom(CONSTANTS.DEFAULT_ZOOM)
        map.flyTo({ center: coordinates });
        
        listPointsInCircle = MapboxGl.getPointsInCircle(dataPoints, coordinatesCircleData)
        map.getSource('places').setData({
            type: 'FeatureCollection',
            features: listPointsInCircle
        })
        
        setShowAllPoint(false)
    }
    
    const onChangeRadius = (value: number) => {
        radius = value
        const layerDrawMaker = map.getLayer('drawMaker')
        if (marker && layerDrawMaker) {
            const coordinatesCircleData = MapboxGl.createCoordinatesCircle([marker._lngLat.lng, marker._lngLat.lat], value)
            map.getSource('polygon').setData({
                'type': 'Polygon',
                'coordinates': coordinatesCircleData
            });
    
            listPointsInCircle  = MapboxGl.getPointsInCircle(dataPoints, coordinatesCircleData)
            if (!showAllPoint) {
                map.getSource('places').setData({
                    type: 'FeatureCollection',
                    features: listPointsInCircle
                })
            }
        }
    }
    
    const handleOptionShowAllPoint = (event) => {
        if (!showAllPoint) {
            map.getSource('places').setData({
                type: 'FeatureCollection',
                features: dataPoints
            })
        } else {
            map.getSource('places').setData({
                type: 'FeatureCollection',
                features: listPointsInCircle
            })
        }
        setShowAllPoint(!showAllPoint)
    }
    
    return (
        <>
            <AutoCompletePlace
                handleSelected={onSelectPosition}
                className='position-absolute box-auto-complete-address'
                placeholder='Tôi hiện đang ở...'
            />
            <Stepper classes='box-radius position-absolute'
                     min={0}
                     max={10}
                     initialLevel={radius}
                     unit='km'
                     onChangeLevel={onChangeRadius}
            />
            <CheckboxInput classes='option-show-all-data'
                           label='Hiển thị tất cả các điểm'
                           checked={showAllPoint}
                           onChange={handleOptionShowAllPoint}
            />
            <div
                ref={mapContainer}
                className='map-container'
            />

            <div id='coordinates' className='coordinates' />
            
            <div className='time-data'>
                <span>Dữ liệu được cập nhật lúc: {dateVerifyData}</span>
            </div>
        </>
    )
}

export default Index
