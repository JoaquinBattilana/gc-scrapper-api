const gcApi = require('../config/gcApi');

exports.getGcSearchPage = query => {
    const url = `/index.php?criterio=${query}&seccion=3&nro_max=50`;
    console.log(url);
    return gcApi.get(`/index.php?criterio=${query}&seccion=3&nro_max=50`)
}
