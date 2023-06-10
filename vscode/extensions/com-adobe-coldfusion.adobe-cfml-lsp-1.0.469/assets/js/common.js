function filterData(arrData, key, value ) {
    let res = {};
    let filterResult = [];

    filterResult = arrData.filter(data => data[key] == value);

    if (filterResult.length) {
        res = filterResult[0];
    }

    return res;
}

function isEmptyObject( object ) {
    return ( Object.keys( object ).length === 0 );
}