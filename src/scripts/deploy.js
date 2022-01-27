import axios from 'axios';


export const deploy = async (collectionName, collectionTokenSymbol, contractBaseURI, collectionSupply, collectionPrice) => {
    
  console.log("here");
  console.log(collectionName, collectionTokenSymbol, contractBaseURI, collectionSupply, collectionPrice);

  const data = {
    "collectionName": collectionName,
    "collectionTokenSymbol": collectionTokenSymbol,
    "contractBaseURI": contractBaseURI,
    "collectionSupply": collectionSupply,
    "collectionPrice": collectionPrice
  }

  axios.post('http://localhost:4000/deploy_contract', data)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

};