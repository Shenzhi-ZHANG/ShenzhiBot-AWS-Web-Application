'use strict';

const filter = (response) => {
  try{
    response.jsonBody = JSON.parse(response.body);
  } catch(e){
  }
  
  return response;
};

module.exports = {
  filter: filter
};