/**
 * Created by on 2017/9/20.
 */

class AppUtils{
    
    constructor(){

    }
    //计算xxhash值，高效验证
    calcXXHash(input, seed){
        let xxhash = 0
        //方法6
        // var H = XXH( seed )
        // xxhash = H
        //     .update( input.slice(0, 20) )
        //     .update( input.slice(20) )
        //     .digest().toString(16)
        //方法5
        // var H = XXH( seed )
        // xxhash = H
        //     .update( input.slice(0, input.length) )
        //     .update( input.slice(input.length) )
        //     .digest().toString(16)
        //方法4 789f13ff
        // var H = XXH( seed )
        // xxhash = H.update( input ).digest().toString(16)
        //方法3 789
		//xxhash = XXH( input, seed ).toString(16)
        //方法2 789....
        // var H = XXH( seed )
        // var xxhash = H.update( input ).digest().toString(16)
        //1 不行
        // xxhash = XXH( input, seed ).toString(16)
        //不行
        // H.update( input.slice(0, input.length) )
        //     .update( input.slice(input.length) )
        //     .digest().toString(16)

        return xxhash
    }


    _generateXXHash(str,seed){

    }


    
}
    
export default new AppUtils();