const DemoLeaveflowModel = function() {
    return {
        uid: null,
        companyId: '',
        userId: '',
        nickName: '',
        leaveDate: '',
        leaveDays: 0,
        reason: '',
        flowInstanceId: '',
        flowStatus: ''
    }
}

const ConditionModel = function() {
    return {
        nickName: '',
        startLeaveDate: '',
        endLeaveDate: ''
    }
}

export { DemoLeaveflowModel, ConditionModel }
