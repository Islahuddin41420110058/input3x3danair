const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // suhu dan kelembaban
    S = (data[0] - 29.5) / 4.611213458  //29.5= avg    4.611213458 = stdev
    K = (data[1] - 50.5) / 28.87509493 
    return [S, K]
}

function denormalized(data){
    O = (data[0] * 0.4) + 0.490051113 // 0.497649258 = stdev  0.45 = avg
    L = (data[1] * 0.496233468) + 0.5625
    return [O, L]
}


async function predict(data){
    let in_dim = 2;
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/Islahuddin41420110058/SKRIPSI/main/public/ex_model/model.json';
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
  
