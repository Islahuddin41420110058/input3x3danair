const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // suhu dan kelembaban
    S = (data[0] - 29.5) / 4.617796207  //29.5= avg    4.611213458 = stdev
    K = (data[1] - 10.5) / 5.77531228375762 
    A = (data[2] - 8.5) / 4.61699192332656
    return [S, K, A]
}

function denormalized(data){
    M = (data[0] * 0.5625) + 0.496855314716221 // 0.497649258 = stdev  0.45 = avg
    N = (data[1] * 0.4) + 0.490665212845968
    O = (data[2] * 0.6875) + 0.46423834544263
    return [M, N, O]
}


async function predict(data){
    let in_dim = 3;
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/Islahuddin41420110058/input3x3danair/main/public/ex_model/model.json';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return denormalized( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    predict: predict 
}
  
