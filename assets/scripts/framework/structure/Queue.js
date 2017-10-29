/**
 * 基础数据代码
 * Created by on 2017/9/19.
 */


class Queue{
    constructor(){
        this.clear()
    }

    finalize(){

    }

    empty(){
    
        return this._last < this._first
    }
    
    size(){
        return this._last - this._first + 1
    }
    
    clear(){
    
        this._queue = {}
        this._first = 0
        this._last  = -1
    }
    
    front(){
    
        if(this.empty()){
            return null
        }
    
        return this._queue[this._first]
    }
    
    getList(){
        return this._queue
    }
    
    back(){
    
        if(this.empty()){
            return null
        }
    
        return this._queue[this._last]
    }
    
    push(data){
    
        this._last  = this._last + 1
        this._queue[this._last] = data
    }
    
    pop(){
    
        if(this.empty()){
            return null
        }
    
        let data                    = this._queue[this._first]
        delete this._queue[this._first]
        this._first                 = this._first + 1
        return data
    }
    
    at(index){
    
        if(this.empty() || index > this.size()){
            return null
        }
    
        return this._queue[this._first + index - 1]
    }
    
    find(data){
        let index = -1
        let size = this.size()
        for(let i=0;i < size;i++){
            let d = this.at(i)
            if(d == data){
                index = i
                break
            }
        }
        return index
    }

}

export default Queue;
