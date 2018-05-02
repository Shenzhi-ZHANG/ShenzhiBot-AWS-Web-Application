'use strict';

const processFilters = (context, filters) => {
  for(let filter of filters){
    context = filter.filter(context);
  }
  
  return context;
};

module.exports = processFilters;