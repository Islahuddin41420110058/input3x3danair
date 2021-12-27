const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // i & r
    S = (data[0] - 29.5) / 4.611213458
    K = (data[1] - 50.5) / 28.87509493
    A = (data[2] - 49.5) / 28.87509493
    O = (data[3] - 0.4) / 0.490051113
    L = (data[4] - 0.5625) / 0.496233468
    J = (data[5] - 0.14) / 0.347095516
    return [S, K, A, O, L, J]
}

const argFact = (compareFn) => (array) => array.map((el, idx) => [el, idx]). reduce(compareFn)[1]
const argMax = argFact((min, el) => (el[0] > min[0] ? el : min ))

function ArgMax(res){
    label = "0|0|1" //POMPA OFF KIPAS OFF KRAN ON
    cls_data = []
    for(i=0; i<res.length; i++){
        cls_data[i] = res[i]
    }
    console.log(cls_data, argMax(cls_data));
    
    if(argMax(cls_data) == 1){
        label = "0|1|1" //POMPA OFF KIPAS OFF KRAN ON
    }if(argMax(cls_data) == 2){
        label = "0|0|0" //POMPA OFF KIPAS OFF KRAN OFF
    }if(argMax(cls_data) == 3){
        label = "0|1|0" //POMPA OFF KIPAS ON KRAN OFF
    }if(argMax(cls_data) == 4){
        label = "1|0|0" //POMPA OFF KIPAS OFF KRAN ON
    }if(argMax(cls_data) == 5){
        label = "1|1|0" //POMPA ON KIPAS ON KRAN OFF
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
