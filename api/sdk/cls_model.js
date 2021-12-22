const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // i & r
    S = (data[0] - 29.5) / 4.617796207
    K = (data[1] - 10.5) / 5.77531228375762
    A = (data[2] - 8.5) / 4.61699192332656
    M = (data[3] - 0.5625) / 0.496855314716221
    N = (data[4] - 0.4) / 0.490665212845968
    O = (data[5] - 0.6875) / 0.46423834544263
    return [S, K, A, M, N, O]
}

const argFact = (compareFn) => (array) => array.map((el, idx) => [el, idx]). reduce(compareFn)[1]
const argMax = argFact((min, el) => (el[0] > min[0] ? el : min ))

function ArgMax(res){
    label = "0|0|1" //KIPAS OFF POMPA OFF AIR ON
    cls_data = []
    for(i=0; i<res.length; i++){
        cls_data[i] = res[i]
    }
    console.log(cls_data, argMax(cls_data));
    
    if(argMax(cls_data) == 1){
        label = "1|0|1" //KIPAS OFF POMPA OFF AIR ON
    }if(argMax(cls_data) == 2){
        label = "0|0|1" //KIPAS ON POMPA OFF AIR OFF
    }if(argMax(cls_data) == 3){
        label = "0|1|1" //KIPAS OFF POMPA ON AIR ON
    }if(argMax(cls_data) == 4){
        label = "1|1|1" //KIPAS ON POMPA ON AIR ON
    }if(argMax(cls_data) == 5){
        label = "1|1|0" //KIPAS ON POMPA ON AIR OFF
    }
    return label
}
async function classify(data){
    let in_dim = 6;
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/Islahuddin41420110058/input3x3danair/main/public/cls_model/model.json';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return ArgMax( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    classify: classify 
}
