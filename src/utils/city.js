const CITY_KEY = 'hkzf_city'
export const getCity = () => JSON.parse(localStorage.getItem(CITY_KEY))
export const setCity = params => localStorage.setItem(CITY_KEY, JSON.stringify(params))
