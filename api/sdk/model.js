const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // suhu dan kelembaban
    S = (data[0] - 29.5) / 4.610572745  //29.5= avg    4.611213458 = stdev 
    K = (data[1] - 5.5) / 2.872780113
    A = (data[2] - 9.5) / 5.189028423
    return [S, K, A]
}

function denormalized(data){
    O = (data[0] * 0.5) + 0.500086828
    L = (data[1] * 0.5625) + 0.496164518
    J = (data[2] * 0.777777778) + 0.415811905
    return [O, L, J]
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
  
