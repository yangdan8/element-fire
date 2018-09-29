const TaskModel = function() {
    return {
        taskId: null,
        taskName: '',
        startTime: '',
        startMan: '',
        processInstanceId: '',
        bussinessId: '',
        bussinessKey: ''
        // private String taskId;
        // private String taskName;
        // private String startTime;
        // private String startMan;
        // private String processInstanceId;
    }
}

const ConditionModel = function() {
    return {
        taskName: '',
        startTime: ''
    }
}

export { TaskModel, ConditionModel }
