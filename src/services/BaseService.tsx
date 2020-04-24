import axios from 'axios'
import * as CONSTANT from '../ultils/Constant'

const ERROR_UNKNOWN = CONSTANT.ERROR_UNKNOWN

axios.defaults.headers.post['Content-Type'] = 'application/json'

const DEFAULT_REQUEST_CONFIG = {
    baseURL: process.env.REACT_APP_API_ENDPOINT,
}

class BaseService {
    public get(url: string, data: any = {}, config: any = {...DEFAULT_REQUEST_CONFIG}) {
        if (data.params) {
            config.params = data.params
        }
        return new Promise((resolve, reject) => {
            return axios.get(url, config)
                .then((res) => {
                    if (!res.data) {
                        reject(ERROR_UNKNOWN)
                    } else {
                        const {result} = res.data
                        if (!result) {
                            resolve(res.data)
                        } else {
                            resolve(result)
                        }
                    }
                })
                .catch((errors) => {
                    if (errors.response && errors.response.data.error) {
                        const {error} = errors.response.data
                        reject(error)
                    } else {
                        reject(ERROR_UNKNOWN)
                    }
                })
        })
    }
    
    public post(url: string, data: any = {}, config: any = DEFAULT_REQUEST_CONFIG) {
        return new Promise((resolve, reject) => {
            axios.post(url, data, config)
                .then((res) => {
                    if (!res.data) {
                        reject(ERROR_UNKNOWN)
                    } else {
                        const {result} = res.data
                        if (!result) {
                            resolve(res.data)
                        } else {
                            resolve(result)
                        }
                    }
                })
                .catch((errors) => {
                    if (errors.response && errors.response.data.error) {
                        const {error} = errors.response.data
                        reject(error)
                    } else {
                        reject(ERROR_UNKNOWN)
                    }
                })
        })
    }
    
    public put(url: string, data: any = {}, config: any = DEFAULT_REQUEST_CONFIG) {
        return new Promise((resolve, reject) => {
            axios.put(url, data, config)
                .then((res) => {
                    if (!res.data) {
                        reject(ERROR_UNKNOWN)
                    } else {
                        const {result} = res.data
                        if (!result) {
                            resolve(res.data)
                        } else {
                            resolve(result)
                        }
                    }
                })
                .catch((errors) => {
                    if (errors.response && errors.response.data.error) {
                        const {error} = errors.response.data
                        reject(error)
                    } else {
                        reject(ERROR_UNKNOWN)
                    }
                })
        })
    }
    
    public delete(url: string, config: any = DEFAULT_REQUEST_CONFIG) {
        return new Promise((resolve, reject) => {
            axios.delete(url, config)
                .then((res) => {
                    if (!res.data) {
                        reject(ERROR_UNKNOWN)
                    } else {
                        const {result} = res.data
                        if (!result) {
                            resolve(res.data)
                        } else {
                            resolve(result)
                        }
                    }
                })
                .catch((errors) => {
                    if (errors.response && errors.response.data.error) {
                        const {error} = errors.response.data
                        reject(error)
                    } else {
                        reject(ERROR_UNKNOWN)
                    }
                })
        })
    }
}

export default BaseService
