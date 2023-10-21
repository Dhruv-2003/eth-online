const natural = require("natural");
const classifier = new natural.BayesClassifier();
const { transactionData } = require("../data/trainingData");

const getClassifier = async () => {
  console.log('this is data ', transactionData)
  transactionData.map((data, index) =>
    classifier.addDocument(data.statement, data.type)
  );
  await classifier.train();
  console.log('data trained');
  return classifier;
}

module.exports = { getClassifier };