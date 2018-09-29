const sysConfigDict = {
    state: {
        postData: {
            categoryCode: '',
            itemCode: '',
            itemName: ''
        },
        explain: '',
        uid: '',
        keepSearchCondition: false,
        clearData: function() {
            this.postData.itemCode = ''
            this.postData.itemName = ''
        }
    }
}

export default sysConfigDict