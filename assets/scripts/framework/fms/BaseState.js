
class BaseState{
    constructor(){
        cc.log("!!!!!BaseState!!!!constructor!!")
    }

    finalize(){

    }

    enter(){
        console.log("!!!!!BaseState!!!enter!!")
    }

    execute(){
        
    }

    exit(){

    }

    onMessage(){

    }
}

export default BaseState;