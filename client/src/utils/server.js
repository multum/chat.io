export const ofServer = (url) => (process.env.REACT_APP_SERVER || '').concat(url)
