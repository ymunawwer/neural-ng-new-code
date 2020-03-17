// const nodeApi = 'http://18.223.247.58:3000/neuralZome/';
const nodeApi = 'http://localhost:3000/neuralZome/';

export const ENV = {

step1:  nodeApi + 'uploadFile',
step2:  nodeApi + 'preprocessing_modelling',
step3A: nodeApi + 'getDetailsForPredict',
step3B: nodeApi + 'getPredictResult',
contactus: nodeApi + 'contactus',
save_data: nodeApi + 'savedata',
select_algo: nodeApi + 'algo_select',
reBuild: nodeApi + 'evaluate'

};
