const SexFilter = (value) => {
    let result = '';
    value = value.toString();
    switch (value) {
        case '0':
            result = '女';
            break;
        case '1':
            result = '男';
            break;
        default:
            result = '外星人';
            break;
    }
    return result;
};
export default SexFilter;