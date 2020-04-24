import BaseService from "./BaseService";

const API_PATH = 'patientapi/list'

class MapService extends BaseService {
    show(url: string = API_PATH, data: any = {}) {
        return this.get(url, data)
    }
    
    getLatLng(url: string = 'https://maps.googleapis.com/maps/api/geocode/json', data: any = {} ) {
        return this.get(url, data)
    }
}

export default MapService
